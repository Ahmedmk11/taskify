// --------------------------------------------------------------
// Backend for the app. This file contains all the functions
// --------------------------------------------------------------

import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import {
    getFirestore,
    collection,
    getDocs,
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

const firebaseConfig = {
    apiKey: "AIzaSyB-hDUl9MHjRBnNl75jhPWxQsDZ0xSa7hM",
    authDomain: "taskmaster-231fe.firebaseapp.com",
    databaseURL: "https://taskmaster-231fe-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "taskmaster-231fe",
    storageBucket: "taskmaster-231fe.appspot.com",
    messagingSenderId: "852107150099",
    appId: "1:852107150099:web:1a30265a547af55468d0e6",
    measurementId: "G-LTCJ2FDP4P"
}

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
