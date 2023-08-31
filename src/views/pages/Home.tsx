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
} from '../../firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { Task } from '../../app/Task'
import { hydrateRoot } from 'react-dom/client'
import { Skeleton } from 'antd'
import { parseDateFromString } from '../../app/Functions'

function Home() {
    const [isVisible, setIsVisible] = useState(false)
    const [user, setUser] = useState(null as unknown as User)
    const [userUID, setUserUID] = useState('')
    const [oldColumn, setOldColumn] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    const [isCol1Input, setIsCol1Input] = useState(false)
    const [isCol2Input, setIsCol2Input] = useState(false)
    const [isCol3Input, setIsCol3Input] = useState(false)

    const [filteredTasks, setFilteredTasks] = useState<any[]>([])

    const [col1Tasks, setCol1Tasks] = useState<any[]>([])
    const [col2Tasks, setCol2Tasks] = useState<any[]>([])
    const [col3Tasks, setCol3Tasks] = useState<any[]>([])

    const [appliedFilters, setAppliedFilters] = useState({
        categoryFilter: null as string[] | null,
        dateFilter: null as Date[] | null,
        priorityFilter: null as string[] | null,
    })

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
                setFilteredTasks(userData!.taskArray)
            }
        })
    }

    useEffect(() => {
        const cols = tasks.filter((task, index) => {
            const dueDate = parseDateFromString(task.dueDate)
            console.log(appliedFilters.priorityFilter)

            let dueDateDay
            let dueDateMonth
            let dueDateYear
            let startDay
            let startMonth
            let startYear
            let endDay
            let endMonth
            let endYear

            if (appliedFilters.dateFilter!.length !== 0) {
                const dueDate = parseDateFromString(task.dueDate)
                const startDate = appliedFilters.dateFilter![0]
                const endDate = appliedFilters.dateFilter![1]

                dueDateDay = dueDate.getDate()
                dueDateMonth = dueDate.getMonth()
                dueDateYear = dueDate.getFullYear()

                startDay = startDate.getDate()
                startMonth = startDate.getMonth()
                startYear = startDate.getFullYear()

                endDay = endDate.getDate()
                endMonth = endDate.getMonth()
                endYear = endDate.getFullYear()
            }

            const isCategoryFiltered =
                appliedFilters.categoryFilter!.length === 0 ||
                task.categories.some((category: string) =>
                    appliedFilters.categoryFilter!.includes(category)
                )

            const isDateFiltered =
                appliedFilters.dateFilter!.length === 0 ||
                !appliedFilters.dateFilter ||
                appliedFilters.dateFilter.length === 0 ||
                ((dueDateYear! > startYear! ||
                    (dueDateYear! === startYear! &&
                        (dueDateMonth! > startMonth! ||
                            (dueDateMonth! === startMonth! &&
                                dueDateDay! >= startDay!)))) &&
                    (dueDateYear! < endYear! ||
                        (dueDateYear! === endYear! &&
                            (dueDateMonth! < endMonth! ||
                                (dueDateMonth! === endMonth! &&
                                    dueDateDay! <= endDay!)))))

            const isPriorityFiltered =
                appliedFilters.priorityFilter!.length === 0 ||
                appliedFilters.priorityFilter!.includes(
                    task.priority.charAt(0).toUpperCase() +
                        task.priority.slice(1)
                )

            return (
                (!appliedFilters.categoryFilter ||
                    appliedFilters.categoryFilter.length === 0 ||
                    isCategoryFiltered) &&
                isDateFiltered &&
                (!appliedFilters.priorityFilter ||
                    appliedFilters.priorityFilter.length === 0 ||
                    isPriorityFiltered)
            )
        })

        setFilteredTasks(cols)
    }, [appliedFilters])

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (
                    Array.from(mutation.removedNodes).some(
                        (node) =>
                            node instanceof HTMLElement &&
                            node.id === 'create-new-task'
                    )
                ) {
                    setIsCol1Input(false)
                    setIsCol2Input(false)
                    setIsCol3Input(false)
                }
            }
        }
    })

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
        const config = { childList: true, subtree: true }
        observer.observe(document.body, config)
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

    const handleFiltersUpdate = (filters: any) => {
        setAppliedFilters(filters)
    }

    function allowDrop(ev: any) {
        ev.preventDefault()
    }

    function createCardPop(col = 'col-1') {
        const colEl = document.getElementById(col)
        const cardsDiv = colEl?.querySelector('.cards')
        cardsDiv?.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
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
        setIsVisible(!isVisible)
        document
            .getElementById('filters-container')
            ?.classList.remove('visibility-hidden')
        if (isVisible) {
            setTimeout(() => {
                document
                    .getElementById('filters-container')
                    ?.classList.add('visibility-hidden')
            }, 300)
        }
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
            targetCardsContainer.insertBefore(
                draggedElement,
                targetColumn.querySelector('.empty-div')
            )
        }
        const targetColumnID = targetColumn.id
        let newStatus = ''
        const taskID = (draggedElement?.childNodes[0] as HTMLElement).id
        const task = tasks.find((task) => task.id == taskID)
        switch (targetColumnID) {
            case 'col-1':
                newStatus = 'todo'
                document
                    .getElementById('col1-msg')
                    ?.setAttribute('style', 'display: none;')
                break
            case 'col-2':
                newStatus = 'inprogress'
                document
                    .getElementById('col2-msg')
                    ?.setAttribute('style', 'display: none;')
                break
            case 'col-3':
                newStatus = 'done'
                document
                    .getElementById('col3-msg')
                    ?.setAttribute('style', 'display: none;')
                break
            default:
                newStatus = 'todo'
                document
                    .getElementById('col1-msg')
                    ?.setAttribute('style', 'display: none;')
                break
        }
        if (task) {
            updateTaskStatus(task.id, newStatus)
            console.log('hhh', task)
            console.log('hhh', newStatus)
            task.status = newStatus
        }
        await reorderTasks()
        window.location.reload()
    }

    function drag(ev: any) {
        const target = ev.target.closest('[class^="draggable-card"]')
        ev.dataTransfer.setData('text', target.id)
        setOldColumn(target.parentElement.parentElement.id)
    }

    async function reorderTasks() {
        // const columns = document.querySelectorAll('.column')
        // const updatedTasks: Task[] = []
        // columns.forEach((column: Element) => {
        //     const cardContainers = column.querySelectorAll('.draggable-card')
        //     cardContainers.forEach((cardContainer: Element) => {
        //         const taskId = cardContainer.querySelector('.card')?.id
        //         if (taskId) {
        //             const task = tasks.find((task) => task.id === taskId)
        //             if (task) {
        //                 updatedTasks.push(task)
        //             }
        //         }
        //     })
        // })
        // console.log(updatedTasks)
        // await updateTasksOrder(updatedTasks)
        // await updateTasksArrayIds()
    }

    return (
        <div id="home-body">
            <ToolBar loading={isLoading ? true : false} />
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
                            handleFiltersUpdate={handleFiltersUpdate}
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
                                                setIsCol1Input(true)
                                            }}
                                            src={plusIcn}
                                            alt="plus icon"
                                        />
                                    </div>
                                </div>
                                <div className="cards">
                                    {isLoading ? (
                                        <>
                                            <Skeleton active />
                                            <Skeleton active />
                                            <Skeleton active />
                                        </>
                                    ) : filteredTasks.filter(
                                          (t) => t.status == 'todo'
                                      ).length == 0 && !isCol1Input ? (
                                        <p id="col1-msg">
                                            No tasks to do right now. Add some
                                            tasks to get started!
                                        </p>
                                    ) : (
                                        filteredTasks.map(
                                            (task, index) =>
                                                task.status === 'todo' && (
                                                    <div
                                                        className="draggable-card"
                                                        id={`card-container-${task.id}`}
                                                        draggable="true"
                                                        onDragStart={drag}
                                                        key={task.id}
                                                    >
                                                        <Card task={task} />
                                                    </div>
                                                )
                                        )
                                    )}
                                    <div
                                        className="empty-div"
                                        style={{ height: '30px' }}
                                    ></div>
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
                                                setIsCol2Input(true)
                                            }}
                                            src={plusIcn}
                                            alt="plus icon"
                                        />
                                    </div>
                                </div>
                                <div className="cards">
                                    {isLoading ? (
                                        <>
                                            <Skeleton active />
                                            <Skeleton active />
                                            <Skeleton active />
                                        </>
                                    ) : filteredTasks.filter(
                                          (t) => t.status == 'inprogress'
                                      ).length == 0 && !isCol2Input ? (
                                        <p id="col2-msg">
                                            No tasks in progress at the moment.
                                            Keep up the great work!
                                        </p>
                                    ) : (
                                        filteredTasks.map(
                                            (task, index) =>
                                                task.status ===
                                                    'inprogress' && (
                                                    <div
                                                        className="draggable-card"
                                                        id={`card-container-${task.id}`}
                                                        draggable="true"
                                                        onDragStart={drag}
                                                        key={task.id}
                                                    >
                                                        <Card task={task} />
                                                    </div>
                                                )
                                        )
                                    )}
                                    <div
                                        className="empty-div"
                                        style={{ height: '30px' }}
                                    ></div>
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
                                                setIsCol3Input(true)
                                            }}
                                            src={plusIcn}
                                            alt="plus icon"
                                        />
                                    </div>
                                </div>
                                <div className="cards">
                                    {isLoading ? (
                                        <>
                                            <Skeleton active />
                                            <Skeleton active />
                                            <Skeleton active />
                                        </>
                                    ) : filteredTasks.filter(
                                          (t) => t.status == 'done'
                                      ).length == 0 && !isCol3Input ? (
                                        <p id="col3-msg">
                                            Congratulations! You've completed
                                            all your tasks.
                                        </p>
                                    ) : (
                                        filteredTasks.map(
                                            (task, index) =>
                                                task.status === 'done' && (
                                                    <div
                                                        className="draggable-card"
                                                        id={`card-container-${task.id}`}
                                                        draggable="true"
                                                        onDragStart={drag}
                                                        key={task.id}
                                                    >
                                                        <Card task={task} />
                                                    </div>
                                                )
                                        )
                                    )}
                                    <div
                                        className="empty-div"
                                        style={{ height: '30px' }}
                                    ></div>
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
