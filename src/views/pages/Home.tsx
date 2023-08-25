// --------------------------------------------------------------
// Home page frontend code.
// --------------------------------------------------------------

'use client'
import React, { useEffect, useState } from 'react'
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
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
    readUserDataFromDb,
    db,
    updateCurrentUserTasksDocument,
    updateTaskStatus,
    updateTasksOrder,
    updateTasksArrayIds,
} from '../../firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { Task } from '../../app/Task'
import { hydrateRoot } from 'react-dom/client'
import Loading from './Loading'

function Home() {
    const [isVisible, setIsVisible] = useState(false)
    const [user, setUser] = useState(null as unknown as User)
    const [userUID, setUserUID] = useState('')
    const [oldColumn, setOldColumn] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [tasks, setTasks] = useState(user ? user.taskArray : [])
    const [firstReload, setFirstReload] = useState(true)
    const location = useLocation()

    async function fetchUserData() {
        const auth = getAuth()
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userData = await readUserDataFromDb(
                    getAuth().currentUser!.uid
                )
                setUserUID(getAuth().currentUser!.uid)
                console.log(userData)
                setUser(userData!)
                setIsLoading(false)
                setTasks(userData!.taskArray)
            }
        })
    }

    // useEffect(() => {
    //     try {
    //         onSnapshot(doc(db, 'users', userUID), (doc) => {
    //             if (tasks.length == 0) {
    //                 console.log('reload: ', doc.data())
    //             let t = [] as Task[]
    //             doc.data()!.tasksArray.forEach((task: any) => {
    //                 let tmp = new Task(
    //                     task.id,
    //                     task.title,
    //                     task.desc,
    //                     task.priority,
    //                     task.dueDate
    //                 )
    //                 tmp.updateCategories(task.categories)
    //                 t.push(tmp)
    //             })
    //             setTasks(t)
    //             }
    //         })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }, [userUID])

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

    useEffect(() => {
        if (location.state?.createCardPop) {
            createCardPop()
        }
    }, [location])

    if (isLoading) {
        return <Loading />
    }

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
        ReactDOM.render(<Card type="create" />, container)
        const cards = colEl!.querySelector('.cards')
        cards!.insertBefore(container, cards!.childNodes[0])
        container.classList.add('show-pop')
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

    async function drop(ev: any) {
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
        let newStatus = ''
        const taskID = (draggedElement?.childNodes[0] as HTMLElement).id
        const task = tasks.find((task) => task.id == taskID)
        switch (targetColumnID) {
            case 'col-1':
                newStatus = 'todo'
                break
            case 'col-2':
                newStatus = 'inprogress'
                break
            case 'col-3':
                newStatus = 'done'
                break
            default:
                newStatus = 'todo'
                break
        }
        if (task) {
            updateTaskStatus(task.id, newStatus)
            console.log('hhh', task)
            console.log('hhh', newStatus)
            task.status = newStatus
        }
        console.log('jsjasajajajasjsajassajdsajndnjdnjksdjnkjkdskcsks')
        await reorderTasks()
        window.location.reload()
    }

    function drag(ev: any) {
        const target = ev.target.closest('[class^="draggable-card"]')
        ev.dataTransfer.setData('text', target.id)
        setOldColumn(target.parentElement.parentElement.id)
    }

    async function reorderTasks() {
        const columns = document.querySelectorAll('.column')
        const updatedTasks: Task[] = []

        columns.forEach((column: Element) => {
            const cardContainers = column.querySelectorAll('.draggable-card')
            cardContainers.forEach((cardContainer: Element) => {
                const taskId = cardContainer.querySelector('.card')?.id
                if (taskId) {
                    const task = tasks.find((task) => task.id === taskId)
                    if (task) {
                        updatedTasks.push(task)
                    }
                }
            })
        })
        console.log(updatedTasks)
        await updateTasksOrder(updatedTasks)
        await updateTasksArrayIds()
    }

    return (
        <div id="home-body">
            <ToolBar />
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
                        <div id="columns-container">
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
            </div>
            <Footer />
        </div>
    )
}

export default Home
