// --------------------------------------------------------------
// Backend for the app. This file contains all the functions
// --------------------------------------------------------------

import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { updateEmail, updatePassword } from "firebase/auth"
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

export async function updateUserName(newName: string): Promise<void> {
    const auth = getAuth()
    const user = auth.currentUser
    if (user) {
        await updateProfile(user, {
            displayName: newName
        })
            .then(() => {
                updateCurrentUserDocument('displayName', newName)
                console.log('Name updated!')
            })
            .catch((error) => {
                console.log(error)
            })
    }
}

export async function updateUserPassword(newPassword: string): Promise<void> {
    const auth = getAuth()
    const user = auth.currentUser!;
    updatePassword(user, newPassword).then(function() {
        console.log('Password updated!');
    }).catch(function(error: any) {
        console.log('error updating password!: ', error);
    });
}

export async function updateUserEmail(newEmail: string): Promise<void> {
    const auth = getAuth()
    const user = auth.currentUser!;
    updateEmail(user, newEmail).then(function() {
        updateCurrentUserDocument('email', newEmail)
        console.log('Email updated!');
    }).catch(function(error: any) {
        console.log('error updating email!: ', error);
    });
}

export function updateCurrentUserDocument(field: string, newValue: string): void {
    const user = getAuth().currentUser
    if (user) {
        const userDocRef = doc(db, 'users', user.uid)
        const userData = {
            [field]: newValue,
        }
        setDoc(userDocRef, userData)
            .then(() => {
                console.log('updated current user in Firestore!')
            })
            .catch((error) => {
                console.log('Error updating current user', error)
            })
    }
}

export function addNewTaskToCurrentUser(task: Task): void {
    const user = getAuth().currentUser
    if (user) {
        const taskDocRef = doc(db, "users", user.uid, "taskArray", task.id);
        const taskData = {
            id: task.id,
            title: task.title,
            desc: task.desc,
            priority: task.priority,
            dueDate: task.dueDate,
            creationDate: task.creationDate,
            status: task.status,
            categories: task.categories,
        }
        setDoc(taskDocRef, taskData)
            .then(() => {
                console.log('updated current user in Firestore!')
            })
            .catch((error) => {
                console.log('Error updating current user', error)
            })
    }
}

export function updateCurrentUserTasksDocument(field: string, newValue: string, task: Task): void {
    const user = getAuth().currentUser
    if (user) {
        const taskDocRef = doc(db, "users", user.uid, "taskArray", task.id);
        const taskData = {
            [field]: newValue,
        }
        setDoc(taskDocRef, taskData)
            .then(() => {
                console.log('updated current user in Firestore!')
            })
            .catch((error) => {
                console.log('Error updating current user', error)
            })
    }
}

export const getUserData = () => {
    return new User(nameAtt, emailAtt, taskArrayAtt, categoriesAtt)
}
