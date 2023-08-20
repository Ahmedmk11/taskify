// --------------------------------------------------------------
// Task page frontend code.
// --------------------------------------------------------------

import React from 'react'
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import ActionBar from '../components/ActionBar'
import Footer from '../components/Footer'
import Card from '../components/Card';
import { User } from '../../app/User'

type TaskProps = {
    user: User
}

function Task(props: TaskProps) {
    const { id } = useParams();
    const { user } = props
    const task = user.taskArray.find(task => task.id == id);

    return (
        <div id="task-body">
            <ToolBar />
            <div id="task-content">
                <NavBar />
                <div id="task-main">
                    <ActionBar isHideButton={true} title={`Task-${task!.id}`} isDisabled={true} />
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
    user: PropTypes.object
}

Task.defaultProps = {
    user: {
        name: 'Ahmed Mahmoud',
        email: 'ahmedmahmoud1903@outlook.com',
        taskArray: [
            {
                id: 1,
                title: 'Start dieting',
                desc: 'Task 1 description',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-08-22'),
                priority: 'medium',
                status: 'todo',
            },
            {
                id: 2,
                title: 'Finish this project',
                desc: 'Task 1 description',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-08-21'),
                priority: 'high',
                status: 'inprogress',
            },
            {
                id: 3,
                title: 'low priority task',
                desc: 'whatever',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-08-21'),
                priority: 'low',
                status: 'inprogress',
            },
            {
                id: 4,
                title: 'mid',
                desc: 'Task 1 description',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-08-21'),
                priority: 'medium',
                status: 'inprogress',
            },
            {
                id: 5,
                title: 'Task not due soon',
                desc: 'Task 1 description',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-09-20'),
                priority: 'high',
                status: 'inprogress',
            },
        ],
        inOrderTasks: [
            {
                id: 1,
                title: 'Start dieting',
                desc: 'Task 1 description',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-08-22'),
                priority: 'medium',
                status: 'todo',
            },
            {
                id: 2,
                title: 'Finish this project',
                desc: 'Task 1 description',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-08-21'),
                priority: 'high',
                status: 'inprogress',
            },
            {
                id: 3,
                title: 'low priority task',
                desc: 'whatever',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-08-21'),
                priority: 'low',
                status: 'inprogress',
            },
            {
                id: 4,
                title: 'mid',
                desc: 'Task 1 description',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-08-21'),
                priority: 'medium',
                status: 'inprogress',
            },
            {
                id: 5,
                title: 'Task not due soon',
                desc: 'Task 1 description',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-09-20'),
                priority: 'high',
                status: 'inprogress',
            },
        ],
        categories: ['Main', 'Work'],
    },
}

export default Task
