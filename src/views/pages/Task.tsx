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
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { readUserDataFromDb } from '../../firebase'

function Task() {
    const { id } = useParams()

    const [user, setUser] = useState(null as unknown as User)
    const [isLoading, setIsLoading] = useState(true)
    const tasks = user ? user.taskArray : []
    const task = tasks.find((task) => task.id == id)

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
        const hideFiltersContainer = () => {
            const filtersContainer =
                document.getElementById('filters-container')
            if (filtersContainer) {
                filtersContainer.classList.add('visibility-hidden')
            }
        }
        hideFiltersContainer()
    }, [user])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div id="task-body">
            <ToolBar />
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
