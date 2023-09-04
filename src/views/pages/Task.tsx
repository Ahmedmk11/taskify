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
    const id = window.location.href.split('/').pop()
    console.log(id)

    const [user, setUser] = useState(null as unknown as User)
    const [isLoading, setIsLoading] = useState(true)
    const [tasks, setTasks] = useState(user ? user.taskArray : [])
    const [task, setTask] = useState(tasks.find((task) => task.id == id))

    async function fetchUserData() {
        const auth = getAuth()
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userData = await readUserDataFromDb(
                    getAuth().currentUser!.uid
                )
                setUser(userData!)
                setTasks(userData!.taskArray)
                setIsLoading(false)
                if (tasks.length > 0)
                    setTask(tasks.find((task) => task.id === id))
            }
        })
    }

    useEffect(() => {
        console.log('task: ', task)
        console.log('tasks: ', tasks)
    }, [task, tasks])

    useEffect(() => {
        if (tasks.length > 0) setTask(tasks.find((task) => task.id === id))
    }, [tasks])

    useEffect(() => {
        async function fetchData() {
            await fetchUserData()
        }
        fetchData()
    }, [])

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
