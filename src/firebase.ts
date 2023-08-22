// --------------------------------------------------------------
// Backend for the app. This file contains all the functions
// --------------------------------------------------------------

import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { updateEmail, updatePassword } from 'firebase/auth'
import {
    getFirestore,
    collection,
    getDoc,
    setDoc,
    doc,
    getDocs,
} from 'firebase/firestore'
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
} from 'firebase/auth'
import { firebaseConfig } from '../firebase-config-data'
import { User } from './app/User'
import { Task } from './app/Task'

let nameAtt: any = 'User Default'
let emailAtt: string = 'defaultemail@email.com'
let taskArrayAtt: Task[] = []
let categoriesAtt: string[] = []

const provider = new GoogleAuthProvider();
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const db = getFirestore(app)

export async function registerUser(
    emailInput: string,
    passwordInput: string,
    nameInput: string
): Promise<void> {
    try {
        await writeNewUserToFirestore(emailInput, passwordInput, nameInput)
        console.log('User registered!')
        emailAtt = emailInput
        nameAtt = nameInput
        window.location.href = '/home'
    } catch (error) {
        console.error('Error registering user:', error)
    }
}

export function signInHandler(
    emailInput: string,
    passwordInput: string
): void {
    const auth = getAuth()
    signInWithEmailAndPassword(auth, emailInput, passwordInput)
        .then((userCredential) => {
            const user = userCredential.user
            console.log(user)
            readUserDataFromDb('users', user.uid)
            window.location.href = '/home'
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            console.log(errorCode, errorMessage)
        })
}

export function signInWithGoogle(): void {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential!.accessToken;
        const user = result.user;
        const displayName = user?.displayName
        window.location.href = '/home'
      }).catch((error) => {
        console.log(error.code, error.message)
      });
}

export function signOutHandler(): void {
    const auth = getAuth()
    signOut(auth)
        .then(() => {
            console.log('User signed out!')
            window.location.href = '/login'
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
            console.log(
                'Error saving user to firestore',
                errorCode + ': ' + errorMessage
            )
        })
}

export async function readUserDataFromDb(
    collID: string,
    docID: string
): Promise<User | null> {
    const docRef = doc(db, collID, docID)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
        console.log('user fetched from firestore')
        return new User(docSnap.data().displayName ,docSnap.data().email, docSnap.data().tasksArray, docSnap.data().categories)
    } else {
        console.log('No such document!')
    }
    return null
}

export async function updateUserName(newName: string): Promise<void> {
    const auth = getAuth()
    const user = auth.currentUser
    if (user) {
        await updateProfile(user, {
            displayName: newName,
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
    const user = auth.currentUser!
    updatePassword(user, newPassword)
        .then(function () {
            console.log('Password updated!')
        })
        .catch(function (error: any) {
            console.log('error updating password!: ', error)
        })
}

export async function updateUserEmail(newEmail: string): Promise<void> {
    const auth = getAuth()
    const user = auth.currentUser!
    updateEmail(user, newEmail)
        .then(function () {
            updateCurrentUserDocument('email', newEmail)
            console.log('Email updated!')
        })
        .catch(function (error: any) {
            console.log('error updating email!: ', error)
        })
}

export function updateCurrentUserDocument(
    field: string,
    newValue: string
): void {
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
        const taskDocRef = doc(db, 'users', user.uid, 'taskArray', task.id)
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

export function updateCurrentUserTasksDocument(
    field: string,
    newValue: string,
    task: Task
): void {
    const user = getAuth().currentUser
    if (user) {
        const taskDocRef = doc(db, 'users', user.uid, 'taskArray', task.id)
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

export async function readAllTasksFromDb(): Promise<Task[]> {
    const user = getAuth().currentUser!
    const userDocRef = doc(db, 'users', user.uid)
    const tasksCollectionRef = collection(userDocRef, 'tasksArray')
    const querySnapshot = await getDocs(tasksCollectionRef)
    const tasks: Task[] = []
    querySnapshot.forEach((doc) => {
        const data = doc.data()
        const task = new Task(
            doc.id,
            data.title,
            data.desc,
            data.priority,
            data.dueDate.toDate()
        )
        tasks.push(task)
    })
    return tasks
}
