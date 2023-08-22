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
import Footer from '../components/Footer'
import { User } from '../../app/User'

type HomeProps = {
    user: User | null
}

function Home(props: HomeProps) {
    const { user } = props
    const tasks = user ? user.taskArray : []
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
            <ToolBar user={user} />
            <div id="home-content">
                <NavBar currentPage={'home'} />
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
                                                <Card task={task} />
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
                                                <Card task={task} />
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
    user: PropTypes.object.isRequired,
}

export default Home
