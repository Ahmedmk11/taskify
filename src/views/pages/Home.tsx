// --------------------------------------------------------------
// Home page frontend code.
// --------------------------------------------------------------

'use client'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import ActionBar from '../components/ActionBar'
import Filter from '../components/Filter'
import plusIcn from '../../assets/icons/plus.svg'
import Card from '../components/Card'
import ReactDOM from 'react-dom'
import { useLocation } from 'react-router-dom'
import { Task } from '../../app/Task'
import Footer from '../components/Footer'
import { User } from '../../app/User'

type HomeProps = {
    currentPage: string
    user: User
}

function Home(props: HomeProps) {
    const { currentPage, user } = props
    const tasks = user.taskArray
    const [isVisible, setIsVisible] = useState(false)
    const location = useLocation()

    useEffect(() => {
        document
            .getElementById('filters-container')
            ?.classList.add('visibility-hidden')
    }, [])

    useEffect(() => {
        if (location.state?.createCardPop) {
            createCardPop()
        }
    }, [location])

    function allowDrop(ev: any) {
        ev.preventDefault()
    }

    function createCardPop(col = 'col-1') {
        const colEl = document.getElementById(col)
        const chk = document.getElementById('create-new-task')
        if (chk) {
            if (chk.closest('#' + col)) {
                return
            } else {
                chk?.remove()
            }
        }
        const container = document.createElement('div')
        container.id = 'create-new-task'
        ReactDOM.render(<Card user={user} type="create" />, container)
        const cards = colEl!.querySelector('.cards')
        cards!.insertBefore(container, cards!.childNodes[0])
        setTimeout(() => {
            container.classList.add('show-pop')
        }, 0)
    }

    const showFilters = () => {
        setIsVisible(true)
        document
            .getElementById('filters-container')
            ?.classList.remove('visibility-hidden')
    }

    const hideFilters = () => {
        setIsVisible(false)
        setTimeout(() => {
            document
                .getElementById('filters-container')
                ?.classList.add('visibility-hidden')
        }, 300)
    }

    function drop(ev: any) {
        ev.preventDefault()
        const data = ev.dataTransfer.getData('text')
        const draggedElement = document.getElementById(data)
        const targetColumn = ev.target.closest('.column')
        const targetCardsContainer = targetColumn.querySelector('.cards')
        const targetCard = ev.target.closest('[class^="draggable-card"]')
        if (targetCard) {
            const targetCardRect = targetCard.getBoundingClientRect()
            const dropPosition = ev.clientY
            if (dropPosition < targetCardRect.top + targetCardRect.height / 2) {
                targetCardsContainer.insertBefore(draggedElement, targetCard)
            } else {
                targetCardsContainer.insertBefore(
                    draggedElement,
                    targetCard.nextSibling
                )
            }
        } else {
            targetCardsContainer.appendChild(draggedElement)
        }
        const targetColumnID = targetColumn.id
        let status = ''
        switch (targetColumnID) {
            case 'col-1':
                status = 'todo'
                break
            case 'col-2':
                status = 'inprogress'
                break
            case 'col-3':
                status = 'done'
                break
            default:
                status = 'todo'
        }
        const taskID = (draggedElement?.childNodes[0] as HTMLElement).id
        const task = tasks.find((task) => task.id == taskID)
        if (task) {
            task.status = status
        }
        console.log(tasks)
    }

    function drag(ev: any) {
        const target = ev.target.closest('[class^="draggable-card"]')
        ev.dataTransfer.setData('text', target.id)
    }

    return (
        <div id="home-body">
            <ToolBar />
            <div id="home-content">
                <NavBar currentPage={currentPage} />
                <div id="home-main">
                    <ActionBar
                        handleCreate={createCardPop}
                        handleFilters={showFilters}
                    />
                    <div
                        id="home-main-content"
                        className={
                            isVisible
                                ? 'show-filter-container'
                                : 'hide-filter-container'
                        }
                    >
                        <Filter
                            className={isVisible ? '' : 'hide-filters'}
                            hideFilters={hideFilters}
                            categories={['Main', 'Work', 'UI Design']}
                        />
                        <div
                            id="col-1"
                            onDrop={drop}
                            className="column"
                            onDragOver={allowDrop}
                        >
                            <div className="cards-status">
                                <p>Todo</p>
                                <div className="image-container">
                                    <img
                                        onClick={() => {
                                            createCardPop('col-1')
                                        }}
                                        src={plusIcn}
                                        alt="plus icon"
                                    />
                                </div>
                            </div>
                            <div className="cards">
                                {tasks.map(
                                    (task, index) =>
                                        task.status === 'todo' && (
                                            <div
                                                className="draggable-card"
                                                id={`card-container-${index}`}
                                                draggable="true"
                                                onDragStart={drag}
                                                key={task.id}
                                            >
                                                <Card task={task} />
                                            </div>
                                        )
                                )}
                            </div>
                        </div>
                        <div
                            id="col-2"
                            onDrop={drop}
                            className="column"
                            onDragOver={allowDrop}
                        >
                            <div className="cards-status">
                                <p>In Progress</p>
                                <div className="image-container">
                                    <img
                                        onClick={() => {
                                            createCardPop('col-2')
                                        }}
                                        src={plusIcn}
                                        alt="plus icon"
                                    />
                                </div>
                            </div>
                            <div className="cards">
                                {tasks.map(
                                    (task, index) =>
                                        task.status === 'inprogress' && (
                                            <div
                                                className="draggable-card"
                                                id={`card-container-${index}`}
                                                draggable="true"
                                                onDragStart={drag}
                                                key={task.id}
                                            >
                                                <Card task={task}/>
                                            </div>
                                        )
                                )}
                            </div>
                        </div>
                        <div
                            id="col-3"
                            onDrop={drop}
                            className="column"
                            onDragOver={allowDrop}
                        >
                            <div className="cards-status">
                                <p>Done</p>
                                <div className="image-container">
                                    <img
                                        onClick={() => {
                                            createCardPop('col-3')
                                        }}
                                        src={plusIcn}
                                        alt="plus icon"
                                    />
                                </div>
                            </div>
                            <div className="cards">
                                {tasks.map(
                                    (task, index) =>
                                        task.status === 'done' && (
                                            <div
                                                className="draggable-card"
                                                id={`card-container-${index}`}
                                                draggable="true"
                                                onDragStart={drag}
                                                key={task.id}
                                            >
                                                <Card task={task}/>
                                            </div>
                                        )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

Home.propTypes = {
    currentPage: PropTypes.string,
    tasks: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
}

Home.defaultProps = {
    currentPage: 'home',
    tasks: [
        {
            id: '1',
            title: 'Task 1 lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            desc: 'This is a description for task 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Donec euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Donec euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Donec euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Donec euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.',
            priority: 'low',
            dueDate: new Date(2023, 4, 16),
            creationDate: new Date(2023, 3, 1),
            status: 'todo',
            categories: ['Main', 'Work'],
        },
        {
            id: '2',
            title: 'Task 2',
            desc: 'This is a description for task 2.',
            priority: 'medium',
            dueDate: new Date(2023, 5, 20),
            creationDate: new Date(2023, 4, 5),
            status: 'inprogress',
            categories: ['Main', 'Personal'],
        },
        {
            id: '3',
            title: 'Task 3',
            desc: 'This is a description for task 3.',
            priority: 'high',
            dueDate: new Date(2023, 6, 25),
            creationDate: new Date(2023, 5, 10),
            status: 'done',
            categories: ['Main', 'Work'],
        },
        {
            id: '4',
            title: 'Task 4',
            desc: 'This is a description for task 4.',
            priority: 'default',
            dueDate: new Date(2025, 6, 30),
            creationDate: new Date(2023, 5, 10),
            status: 'done',
            categories: ['Main', 'Test', 'Work'],
        },
    ],
    user: {
        name: 'User Default',
        email: 'defaultemail@email.com',
        taskArray: [
            {
                id: 1,
                title: 'Task 1',
                desc: 'Task 1 Description',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-08-22'),
                priority: 'medium',
                status: 'todo',
            }
        ],
        inOrderTasks: [
            {
                id: 1,
                title: 'Task 1',
                desc: 'Task 1 Description',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-08-22'),
                priority: 'medium',
                status: 'todo',
            }
        ],
        categories: ['Main', 'Work', 'Personal'],
    },
}

export default Home
