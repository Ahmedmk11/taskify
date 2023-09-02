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

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

function Home() {
    const [user, setUser] = useState(null as unknown as User)
    const [isLoading, setIsLoading] = useState(true)

    const [isCol1Input, setIsCol1Input] = useState(false)
    const [isCol2Input, setIsCol2Input] = useState(false)
    const [isCol3Input, setIsCol3Input] = useState(false)

    const [filteredTasks, setFilteredTasks] = useState<any[]>([])

    const [appliedFilters, setAppliedFilters] = useState({
        categoryFilter: null as string[] | null,
        dateFilter: null as Date[] | null,
        priorityFilter: null as string[] | null,
    })

    const [tasks, setTasks] = useState(user ? user.taskArray : [])
    const location = useLocation()

    async function fetchUserData() {
        const auth = getAuth()
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userData = await readUserDataFromDb(
                    getAuth().currentUser!.uid
                )
                console.log(userData)
                setUser(userData!)
                setIsLoading(false)
                setTasks(userData!.taskArray)
                setFilteredTasks(userData!.taskArray)
            }
        })
    }

    useEffect(() => {
        try {
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

                if (appliedFilters.dateFilter?.length !== 0) {
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
        } catch {}
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

    useEffect(() => {
        async function fetchData() {
            await fetchUserData()
        }
        fetchData()
        const config = { childList: true, subtree: true }
        observer.observe(document.body, config)
    }, [])

    useEffect(() => {
        if (location.state?.createCardPop) {
            createCardPop()
        }
    }, [location])

    const handleFiltersUpdate = (filters: any) => {
        setAppliedFilters(filters)
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
        document
            .getElementById('filters-container')
            ?.classList.toggle('show-filters')
    }

    const hideFilters = () => {
        document
            .getElementById('filters-container')
            ?.classList.toggle('show-filters')
    }

    const handleDragEnd = (result: any) => {
        if (!result.destination) {
            return
        }
        const sourceIndex = result.source.index
        const destinationIndex = result.destination.index
        const sourceColumnId = result.source.droppableId
        const destinationColumnId = result.destination.droppableId
        const draggedTask = filteredTasks[sourceIndex]
        const updatedFilteredTasks = [...filteredTasks]
        updatedFilteredTasks.splice(sourceIndex, 1)

        const firstTaskInDestinationColumnIndex =
            updatedFilteredTasks.findIndex(
                (task) => task.status === destinationColumnId
            )

        const newDestinationIndex =
            firstTaskInDestinationColumnIndex + destinationIndex

        updatedFilteredTasks.splice(newDestinationIndex, 0, draggedTask)

        const taskIndex = tasks.findIndex((task) => task.id === draggedTask.id)
        const updatedTasks = [...tasks]
        updatedTasks[taskIndex].status = destinationColumnId
        setFilteredTasks(updatedFilteredTasks)
        setTasks(updatedTasks)
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
                    <div id="home-main-content">
                        <Filter
                            hideFilters={hideFilters}
                            handleFiltersUpdate={handleFiltersUpdate}
                        />
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <div id="columns-container">
                                <div id="col-1" className="column">
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
                                    <Droppable
                                        droppableId="todo"
                                        direction="vertical"
                                    >
                                        {(provided) => (
                                            <div
                                                className="cards"
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Skeleton active />
                                                        <Skeleton active />
                                                        <Skeleton active />
                                                    </>
                                                ) : filteredTasks.filter(
                                                      (t) => t.status == 'todo'
                                                  ).length == 0 &&
                                                  !isCol1Input ? (
                                                    <p id="col1-msg">
                                                        No tasks to do right
                                                        now. Add some tasks to
                                                        get started!
                                                    </p>
                                                ) : (
                                                    filteredTasks.map(
                                                        (task, index) =>
                                                            task.status ===
                                                                'todo' && (
                                                                <Draggable
                                                                    key={`card-container-${task.id}`}
                                                                    draggableId={`card-container-${task.id}`}
                                                                    index={
                                                                        index
                                                                    }
                                                                >
                                                                    {(
                                                                        provided
                                                                    ) => (
                                                                        <div
                                                                            ref={
                                                                                provided.innerRef
                                                                            }
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            className="draggable-card"
                                                                            id={`card-container-${task.id}`}
                                                                            key={
                                                                                task.id
                                                                            }
                                                                        >
                                                                            <Card
                                                                                task={
                                                                                    task
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            )
                                                    )
                                                )}
                                                <div
                                                    className="empty-div"
                                                    style={{ height: '30px' }}
                                                ></div>
                                            </div>
                                        )}
                                    </Droppable>
                                </div>

                                <div id="col-2" className="column">
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
                                    <Droppable
                                        droppableId="inprogress"
                                        direction="vertical"
                                    >
                                        {(provided) => (
                                            <div
                                                className="cards"
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Skeleton active />
                                                        <Skeleton active />
                                                        <Skeleton active />
                                                    </>
                                                ) : filteredTasks.filter(
                                                      (t) =>
                                                          t.status ==
                                                          'inprogress'
                                                  ).length == 0 &&
                                                  !isCol2Input ? (
                                                    <p id="col2-msg">
                                                        No tasks in progress at
                                                        the moment. Keep up the
                                                        great work!
                                                    </p>
                                                ) : (
                                                    filteredTasks.map(
                                                        (task, index) =>
                                                            task.status ===
                                                                'inprogress' && (
                                                                <Draggable
                                                                    key={`card-container-${task.id}`}
                                                                    draggableId={`card-container-${task.id}`}
                                                                    index={
                                                                        index
                                                                    }
                                                                >
                                                                    {(
                                                                        provided
                                                                    ) => (
                                                                        <div
                                                                            ref={
                                                                                provided.innerRef
                                                                            }
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            className="draggable-card"
                                                                            id={`card-container-${task.id}`}
                                                                            key={
                                                                                task.id
                                                                            }
                                                                        >
                                                                            <Card
                                                                                task={
                                                                                    task
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            )
                                                    )
                                                )}
                                                <div
                                                    className="empty-div"
                                                    style={{ height: '30px' }}
                                                ></div>
                                            </div>
                                        )}
                                    </Droppable>
                                </div>

                                <div id="col-3" className="column">
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
                                    <Droppable
                                        droppableId="done"
                                        direction="vertical"
                                    >
                                        {(provided) => (
                                            <div
                                                className="cards"
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Skeleton active />
                                                        <Skeleton active />
                                                        <Skeleton active />
                                                    </>
                                                ) : filteredTasks.filter(
                                                      (t) => t.status == 'done'
                                                  ).length == 0 &&
                                                  !isCol3Input ? (
                                                    <p id="col3-msg">
                                                        Congratulations! You've
                                                        completed all your
                                                        tasks.
                                                    </p>
                                                ) : (
                                                    filteredTasks.map(
                                                        (task, index) =>
                                                            task.status ===
                                                                'done' && (
                                                                <Draggable
                                                                    key={`card-container-${task.id}`}
                                                                    draggableId={`card-container-${task.id}`}
                                                                    index={
                                                                        index
                                                                    }
                                                                >
                                                                    {(
                                                                        provided
                                                                    ) => (
                                                                        <div
                                                                            ref={
                                                                                provided.innerRef
                                                                            }
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            className="draggable-card"
                                                                            id={`card-container-${task.id}`}
                                                                            key={
                                                                                task.id
                                                                            }
                                                                        >
                                                                            <Card
                                                                                task={
                                                                                    task
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            )
                                                    )
                                                )}
                                                <div
                                                    className="empty-div"
                                                    style={{ height: '30px' }}
                                                ></div>
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            </div>
                        </DragDropContext>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Home
