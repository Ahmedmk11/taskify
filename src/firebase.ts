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

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const db = getFirestore(app)

export async function registerUser(e: Event, emailInput: string, passwordInput: string, fullNameInput: string): Promise<void> {
    e.preventDefault()
    try {
        await writeToDB(emailInput, passwordInput, fullNameInput)
        console.log('User registered and data saved to Firestore successfully')
        // navigate('/') // Navigate to the home page
    } catch (error) {
        console.error('Error registering user:', error)
    }
}

export function signInHandler(e: Event, emailInput: string, passwordInput: string): void {
    e.preventDefault()
    const auth = getAuth()
    signInWithEmailAndPassword(auth, emailInput, passwordInput)
        .then((userCredential) => { 
            const user = userCredential.user
            console.log(user)
            // navigate('/') // Navigate to the home page
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            console.log(errorCode, errorMessage)
        })
}

export function signOutHandler(): void {
    const auth = getAuth()
    signOut(auth).then(() => {
        console.log('User signed out!')
        // navigate('/') // Navigate to the sign in page
    }).catch((error) => {
        console.log(error)
    })
}

export async function writeToDB(email: string, password: string, name: string): Promise<void> {
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user
            const userDocRef = doc(db, 'users', user.uid)
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: name,
                inProgressTasks: [],
                completedTasks: [],
                inOrderTasks: [],
                categories: []
            }
            return setDoc(userDocRef, userData)
        })
        .then(() => {
            console.log('User data saved to Firestore')
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            console.log(errorCode, errorMessage)
        })
}

export async function readDataFromDB(collID: string, docID: string): Promise<void> { // check if this works
    const docRef = doc(db, collID, docID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
    } else {
        console.log("No such document!");
    }
}
