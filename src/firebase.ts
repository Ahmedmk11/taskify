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
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyDViC_ryeWhFGhNE5lR7AtotxRcol-BHN8',
    authDomain: 'testing-70c91.firebaseapp.com',
    projectId: 'testing-70c91',
    storageBucket: 'testing-70c91.appspot.com',
    messagingSenderId: '154061849766',
    appId: '1:154061849766:web:3f0402987daed28539e067',
    measurementId: 'G-KLN7YFJ463',
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const db = getFirestore(app)

export async function readFromDB() {
    const users = collection(db, 'users')
    const usersSnapshot = await getDocs(users)
    const usersList = usersSnapshot.docs.map((doc) => doc.data())
    console.log(usersList)
}

export async function writeToDB(email, password, name) {
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user
            const userDocRef = doc(db, 'users2', user.uid)
            const userData = {
                email: user.email,
                uid: user.uid,
                password: password,
            }
            updateProfile(user, { displayName: name })
                .then(() => {
                    console.log(
                        'User registered with full name:',
                        user.displayName
                    )
                })
                .catch((error) => {
                    console.log('Error updating display name:', error)
                })
            return setDoc(userDocRef, userData)
        })
        .then(() => {
            // User data saved to Firestore successfully
            console.log('User data saved to Firestore')
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            // Handle error
            console.log(errorCode, errorMessage)
        })
}
