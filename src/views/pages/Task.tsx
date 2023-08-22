// --------------------------------------------------------------
// Task page frontend code.
// --------------------------------------------------------------

import React from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import ActionBar from '../components/ActionBar'
import Footer from '../components/Footer'
import Card from '../components/Card'
import { User } from '../../app/User'

type TaskProps = {
    user: User | null
}

function Task(props: TaskProps) {
    const { id } = useParams()
    const { user } = props
    const task = user!.taskArray.find((task) => task.id == id)

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
