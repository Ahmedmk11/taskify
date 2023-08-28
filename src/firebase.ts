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
    arrayUnion,
    updateDoc,
    onSnapshot,
    FieldValue,
    arrayRemove,
} from 'firebase/firestore'
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
} from 'firebase/auth'
import { firebaseConfig } from '../firebase-config-data'
import { User } from './app/User'
import { Task } from './app/Task'
import {
    AppCheck,
    initializeAppCheck,
    ReCaptchaV3Provider,
} from 'firebase/app-check'

const provider = new GoogleAuthProvider()
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
export const db = getFirestore(app)

initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(
        '6LfXeb4nAAAAAFxeH46IPLGhwGEq3uw9M2h1IyxE'
    ),
    isTokenAutoRefreshEnabled: true,
})

// export async function registerUser(
//     emailInput: string,
//     passwordInput: string,
//     nameInput: string
// ): Promise<void> {
//     try {
//         await writeNewUserToFirestore(emailInput, passwordInput, nameInput)
//         console.log('User registered!')
//     } catch (error) {
//         console.error('Error registering user:', error)
//     }
// }

export async function writeNewUserToFirestore(
    emailInput: string,
    nameInput: string,
    user: any
) {
    try {
        const userDocRef = doc(db, 'users', user.uid)
        const userData = {
            id: user.uid,
            email: emailInput,
            displayName: nameInput,
            tasksArray: [],
            categories: [],
        }
        setDoc(userDocRef, userData)
    } catch (error) {
        console.log('error saving to firestore', error)
    }
}
export async function signInHandler(
    emailInput: string,
    passwordInput: string
): Promise<boolean> {
    const auth = getAuth()
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            emailInput,
            passwordInput
        )
        const user = userCredential.user
        console.log(user)
        await readUserDataFromDb(user.uid)
        window.location.href = '/home'
        return true
    } catch (error: any) {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)
        console.log('tptototoottoto')
        return false
    }
}

export async function signInWithGoogle(): Promise<void> {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()
    try {
        const result = await signInWithPopup(auth, provider)
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential!.accessToken
        const user = result.user

        if (user.email && user.displayName && credential) {
            await writeNewUserToFirestore(user.email, user.displayName, user)
            await readUserDataFromDb(user.uid)
            window.location.href = '/home'
        } else {
            console.error('User data incomplete')
        }
    } catch (error: any) {
        console.error(error.code, error.message)
    }
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

export async function registerUser(
    email: string,
    password: string,
    name: string
): Promise<void> {
    const auth = getAuth()
    await createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            await writeNewUserToFirestore(email, name, userCredential.user)
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            console.log(
                'Error registering user',
                errorCode + ': ' + errorMessage
            )
        })
}

export async function sendPasswordResetEmailHandler(
    email: string
): Promise<void> {
    const auth = getAuth()
    sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log('Password reset email sent!')
        })
        .catch((error) => {
            console.log(error, error.message)
        })
}

export async function readUserDataFromDb(docID: string): Promise<User | null> {
    const docRef = doc(db, 'users', docID)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
        console.log('user fetched from firestore')
        return new User(
            docSnap.data().displayName,
            docSnap.data().email,
            docSnap.data().tasksArray,
            docSnap.data().categories
        )
    } else {
        console.log('No such document!')
        return null
    }
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
    newValue: string[] | string,
    overwrite: boolean = false
): void {
    const user = getAuth().currentUser
    if (user) {
        const userDocRef = doc(db, 'users', user.uid)
        let updateData = {}
        if (overwrite) {
            updateData = {
                [field]: newValue,
            }
        } else {
            if (typeof newValue === 'string') {
                updateData = {
                    [field]: newValue,
                }
            } else if (Array.isArray(newValue)) {
                updateData = {
                    [field]: arrayUnion(...newValue),
                }
            }
        }

        updateDoc(userDocRef, updateData)
            .then(() => {
                console.log('Updated current user in Firestore!')
            })
            .catch((error) => {
                console.log('Error updating current user', error)
            })
    }
}

export function updateTaskCategories(
    taskId: string,
    newCategories: string[],
    overwrite: boolean = false
): void {
    const user = getAuth().currentUser
    if (user) {
        const userDocRef = doc(db, 'users', user.uid)
        getDoc(userDocRef).then((docSnapshot) => {
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data()
                if (userData) {
                    const tasksArray = userData.tasksArray
                    const taskIndex = tasksArray.findIndex(
                        (task: any) => task.id === taskId
                    )
                    if (taskIndex !== -1) {
                        const updatedTask = { ...tasksArray[taskIndex] }
                        if (overwrite) {
                            updatedTask.categories = newCategories
                        } else {
                            const existingCategories =
                                updatedTask.categories || []
                            updatedTask.categories = [
                                ...new Set([
                                    ...existingCategories,
                                    ...newCategories,
                                ]),
                            ]
                        }
                        tasksArray[taskIndex] = updatedTask
                        const updateData = {
                            tasksArray: tasksArray,
                        }
                        updateDoc(userDocRef, updateData)
                            .then(() => {
                                console.log(
                                    'Updated task categories in Firestore!'
                                )
                            })
                            .catch((error) => {
                                console.log(
                                    'Error updating task categories',
                                    error
                                )
                            })
                    }
                }
            }
        })
    }
}

export function addNewTaskToCurrentUser(task: Task): void {
    const user = getAuth().currentUser
    if (user) {
        const userDocRef = doc(db, 'users', user.uid)
        const userData = {
            tasksArray: arrayUnion({
                id: task.id,
                title: task.title,
                desc: task.desc,
                priority: task.priority,
                dueDate: task.dueDate,
                creationDate: task.creationDate,
                status: task.status,
                categories: task.categories,
            }),
        }
        updateDoc(userDocRef, userData)
            .then(() => {
                console.log('updated current user in Firestore!')
            })
            .catch((error) => {
                console.log('Error updating current user', error)
            })
    }
}

export function addNewCategoryToCurrentUser(cat: string): void {
    const user = getAuth().currentUser
    if (user) {
        const userDocRef = doc(db, 'users', user.uid)
        const userData = {
            categories: arrayUnion(cat),
        }
        updateDoc(userDocRef, userData)
            .then(() => {
                console.log('Added new category in Firestore!')
            })
            .catch((error) => {
                console.log('Error adding category', error)
            })
    }
}

export function deleteCategoryFromUser(cat: string): void {
    const user = getAuth().currentUser
    if (user) {
        const userDocRef = doc(db, 'users', user.uid)
        const userData = {
            categories: arrayRemove(cat),
        }
        updateDoc(userDocRef, userData)
            .then(() => {
                console.log('Removed category from Firestore!')
            })
            .catch((error) => {
                console.log('Error removing category', error)
            })
    }
}

export function updateCurrentUserTasksDocument(
    field: string,
    newValue: string,
    task: Task
): void {
    const user = getAuth().currentUser
    console.log('hellooooo', newValue)
    if (user) {
        const userDocRef = doc(db, 'users', user.uid)
        const taskData = {
            [`tasksArray.${task.id}.${field}`]: newValue,
        }
        updateDoc(userDocRef, taskData)
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

export async function updateTaskStatus(
    taskId: string,
    newStatus: string
): Promise<void> {
    const user = getAuth().currentUser
    if (user) {
        const userDocRef = doc(db, 'users', user.uid)
        const docSnapshot = await getDoc(userDocRef)

        if (docSnapshot.exists()) {
            const userData = docSnapshot.data()
            if (userData) {
                const tasksArray = userData.tasksArray
                const taskIndex = tasksArray.findIndex(
                    (task: any) => task.id === taskId
                )

                if (taskIndex !== -1) {
                    const updatedTasksArray = [...tasksArray]
                    const updatedTask = { ...updatedTasksArray[taskIndex] }
                    updatedTask.status = newStatus
                    updatedTasksArray[taskIndex] = updatedTask

                    const updateData = {
                        tasksArray: updatedTasksArray,
                    }

                    try {
                        await updateDoc(userDocRef, updateData)
                        console.log('Updated task status in Firestore!')
                    } catch (error) {
                        console.log('Error updating task status', error)
                    }
                }
            }
        }
    }
}

export async function deleteTaskFromUser(taskId: string) {
    try {
        // Get a reference to the user document
        const user = getAuth().currentUser
        const userRef = doc(db, 'users', user!.uid)

        // Get the user document data
        const userDoc = await getDoc(userRef)
        const userData = userDoc.data()

        if (userData) {
            // Find the index of the task based on taskId
            const taskIndex = userData.tasksArray.findIndex(
                (task: Task) => task.id === taskId
            )

            if (taskIndex !== -1) {
                userData.tasksArray.splice(taskIndex, 1)
                await updateDoc(userRef, { tasksArray: userData.tasksArray })
                console.log('Task deleted successfully')
            } else {
                console.log('Task not found')
            }
        } else {
            console.log('User not found')
        }
    } catch (error) {
        console.error('Error deleting task:', error)
    }
}

export async function updateTasksOrder(updatedTasks: Task[]) {
    const user = getAuth().currentUser
    if (user) {
        const userDocRef = doc(db, 'users', user.uid)
        const docSnapshot = await getDoc(userDocRef)

        if (docSnapshot.exists()) {
            const userData = docSnapshot.data()

            if (userData) {
                const updateData = {
                    tasksArray: updatedTasks,
                }

                try {
                    await updateDoc(userDocRef, updateData)
                    console.log('Updated task order in Firestore!')
                } catch (error) {
                    console.log('Error updating task order:', error)
                }
            }
        }
    }
}

export async function updateTasksArrayIds() {
    const user = getAuth().currentUser
    if (user) {
        const userDocRef = doc(db, 'users', user.uid)
        const docSnapshot = await getDoc(userDocRef)

        if (docSnapshot.exists()) {
            const userData = docSnapshot.data()

            if (userData) {
                const tasksArray = [...userData.tasksArray]

                // Sort tasksArray based on some criteria, like creationDate
                tasksArray.sort((a, b) => a.creationDate - b.creationDate)

                // Update task IDs and create a new tasksArray with updated IDs
                const updatedTasksArray = tasksArray.map((task, index) => {
                    const updatedTask = { ...task, id: index.toString() }
                    return updatedTask
                })

                // Update the tasksArray in Firestore
                const updateData = {
                    tasksArray: updatedTasksArray,
                }

                try {
                    await updateDoc(userDocRef, updateData)
                    console.log('Updated task IDs in Firestore!')
                } catch (error) {
                    console.log('Error updating task IDs:', error)
                }
            }
        }
    }
}

export async function saveEditsToDB(task: any) {
    try {
        console.log('inside save try')
        const user = getAuth().currentUser
        const userDocRef = doc(db, 'users', user!.uid)
        const userDocSnapshot = await getDoc(userDocRef)
        const userData = userDocSnapshot.data()
        console.log(task)

        if (userData) {
            const taskIndex = userData.tasksArray.findIndex(
                (t: Task) => t.id === task.id
            )
            if (taskIndex !== -1) {
                if (task.title) {
                    userData.tasksArray[taskIndex].title = task.title
                }
                if (task.desc) {
                    userData.tasksArray[taskIndex].desc = task.desc
                }
                if (task.priority) {
                    userData.tasksArray[taskIndex].priority = task.priority
                }
                if (task.dueDate) {
                    userData.tasksArray[taskIndex].dueDate = task.dueDate
                }
                if (task.categories) {
                    userData.tasksArray[taskIndex].categories = task.categories
                } else {
                    userData.tasksArray[taskIndex].categories = []
                }
                console.log(userData.tasksArray)
                await updateDoc(userDocRef, { tasksArray: userData.tasksArray })
            }
        }
        console.log('Saved edits to database!')
    } catch (error) {
        console.error('Error updating task:', error)
    }
}
