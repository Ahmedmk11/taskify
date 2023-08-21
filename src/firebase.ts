// --------------------------------------------------------------
// Backend for the app. This file contains all the functions
// --------------------------------------------------------------

import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import {
    getFirestore,
    collection,
    getDoc,
    setDoc,
    doc,
} from 'firebase/firestore'
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut,
    signInWithEmailAndPassword,
} from 'firebase/auth'

import { firebaseConfig } from '../firebase-config-data'
import { User } from './app/User'
import { useNavigate } from 'react-router-dom'
import { Task } from './app/Task'
const navigate = useNavigate()

let nameAtt: any = 'User Default'
let emailAtt: string = 'defaultemail@email.com'
let taskArrayAtt: Task[] = []
let categoriesAtt: string[] = []

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const db = getFirestore(app)

export async function registerUser(
    e: Event,
    emailInput: string,
    passwordInput: string,
    nameInput: string
): Promise<void> {
    e.preventDefault()
    try {
        await writeNewUserToFirestore(emailInput, passwordInput, nameInput)
        console.log('User registered!')
        emailAtt = emailInput
        nameAtt = nameInput
        navigate('/home')
    } catch (error) {
        console.error('Error registering user:', error)
    }
}

export function signInHandler(
    e: Event,
    emailInput: string,
    passwordInput: string
): void {
    e.preventDefault()
    const auth = getAuth()
    signInWithEmailAndPassword(auth, emailInput, passwordInput)
        .then((userCredential) => {
            const user = userCredential.user
            console.log(user)
            readDataFromDbOnLogin('users', user.uid)
            navigate('/home')
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            console.log(errorCode, errorMessage)
        })
}

export function signOutHandler(): void {
    const auth = getAuth()
    signOut(auth)
        .then(() => {
            console.log('User signed out!')
            navigate('/login')
        })
        .catch((error) => {
            console.log(error)
        })
}

export async function writeNewUserToFirestore(
    email: string,
    password: string,
    name: string
): Promise<void> {
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user
            const userDocRef = doc(db, 'users', user.uid)
            const userData = {
                id: user.uid,
                email: user.email,
                displayName: name,
                tasksArray: [],
                categories: [],
            }
            return setDoc(userDocRef, userData)
        })
        .then(() => {
            console.log('User data saved to Firestore!')
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            console.log('Error saving user to firestore', errorCode+': '+errorMessage)
        })
}

export async function readDataFromDbOnLogin(
    collID: string,
    docID: string
): Promise<void> {
    const docRef = doc(db, collID, docID)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
        console.log('user fetched from firestore')
        nameAtt = docSnap.data().displayName
        emailAtt = docSnap.data().email
        taskArrayAtt = docSnap.data().tasksArray
        categoriesAtt = docSnap.data().categories
    } else {
        console.log('No such document!')
    }
}

export const getUserData = () => {
    return new User(nameAtt, emailAtt, taskArrayAtt, categoriesAtt)
}
