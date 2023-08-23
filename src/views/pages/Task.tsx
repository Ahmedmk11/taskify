// --------------------------------------------------------------
// Task page frontend code.
// --------------------------------------------------------------

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import ActionBar from '../components/ActionBar'
import Footer from '../components/Footer'
import Card from '../components/Card'
import { User } from '../../app/User'
import { getAuth } from 'firebase/auth'
import { readUserDataFromDb } from '../../firebase'

function Task() {
    const { id } = useParams()

    const [user, setUser] = useState(null as unknown as User)
    const [isLoading, setIsLoading] = useState(true)
    const tasks = user ? user.taskArray : []
    const currentUser = getAuth().currentUser
    const task = tasks.find((task) => task.id == id)

    async function fetchUserData() {
        const userData = await readUserDataFromDb('users', currentUser!.uid)
        setUser(userData!)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchUserData()
    }, [])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div id="task-body">
            <ToolBar user={user} />
            <div id="task-content">
                <NavBar />
                <div id="task-main">
                    <ActionBar
                        isHideButton={true}
                        title={`Task-${task!.id}`}
                        isDisabled={true}
                    />
                    <div id="task-main-content">
                        {task && <Card task={task} />}
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
