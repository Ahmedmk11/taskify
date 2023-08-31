// --------------------------------------------------------------
// Task page frontend code.
// --------------------------------------------------------------

import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import ActionBar from '../components/ActionBar'
import Footer from '../components/Footer'
import Card from '../components/Card'
import { User } from '../../app/User'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db, readUserDataFromDb } from '../../firebase'
import { EditCardContext } from '../components/EditCardProvider'
import { doc, onSnapshot } from 'firebase/firestore'

function Task() {
    const { id } = useParams()

    const [user, setUser] = useState(null as unknown as User)
    const [isLoading, setIsLoading] = useState(true)
    let tasks = user ? user.taskArray : []
    const [task, setTask] = useState(tasks.find((task) => task.id == id))

    async function fetchUserData() {
        const auth = getAuth()
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userData = await readUserDataFromDb(
                    getAuth().currentUser!.uid
                )
                setUser(userData!)
                setIsLoading(false)
            }
        })
    }

    useEffect(() => {
        async function fetchData() {
            await fetchUserData()
        }
        fetchData()
    }, [])

    useEffect(() => {
        try {
            const userUID = getAuth().currentUser?.uid
            if (userUID) {
                const userDocRef = doc(db, 'users', userUID)
                onSnapshot(userDocRef, (docSnapshot) => {
                    const data = docSnapshot.data()
                    if (data) {
                        setTask(
                            data.tasksArray.find((task: any) => task.id == id)
                        )
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        const hideFiltersContainer = () => {
            const filtersContainer =
                document.getElementById('filters-container')
            if (filtersContainer) {
                filtersContainer.classList.add('visibility-hidden')
            }
        }
        hideFiltersContainer()
    }, [user])

    return (
        <div id="task-body">
            <ToolBar />
            <div id="task-content">
                <NavBar />
                <div id="task-main">
                    <ActionBar
                        isHideButton={true}
                        title={`${task?.title}`}
                        isDisabled={true}
                    />
                    <div id="task-main-content">
                        {task && (
                            <div
                                id={`card-container-${task.id}`}
                                className="draggable-card"
                            >
                                <Card task={task} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

Task.propTypes = {
    user: PropTypes.object,
}

export default Task
