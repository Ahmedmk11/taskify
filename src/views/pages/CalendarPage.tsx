// --------------------------------------------------------------
// Calendar page frontend code.
// --------------------------------------------------------------

import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import ActionBar from '../components/ActionBar'
import Footer from '../components/Footer'
import { User } from '../../app/User'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { readUserDataFromDb } from '../../firebase'
import type { Dayjs } from 'dayjs'
import type { BadgeProps, CalendarProps } from 'antd'
import { Badge, Calendar } from 'antd'
import DayPopup from '../components/DayPopup'
import { parseDateFromString } from '../../app/Functions'
import dayjs from 'dayjs'

function CalendarPage() {
    const [user, setUser] = useState(null as unknown as User)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedDay, setSelectedDay] = useState<Dayjs | null>(null)
    const tasks = user ? user.taskArray : []

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

    const getTasksOnCertainDay = (value: Dayjs) => {
        const selectedDate = value.toDate()
        const tasksOnDay = tasks.filter((task) => {
            const taskDate = parseDateFromString(task.dueDate)
            return dayjs(taskDate).isSame(selectedDate, 'day')
        })
        return tasksOnDay
    }

    const dateCellRender = (value: Dayjs) => {
        const day = value.date()
        const tasksOnDay = getTasksOnCertainDay(value)

        return (
            <div
                className={`calendar-date ${
                    day === selectedDay?.date() ? 'selected' : ''
                }`}
            >
                <ul className="events">
                    {tasksOnDay.map((task) => (
                        <li
                            key={task.id}
                            className={`task-list-item li-${task.priority}`}
                        >
                            <span>{task.title}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
        if (info.type === 'date') return dateCellRender(current)
        return info.originNode
    }

    return (
        <div id="calendar-body">
            <ToolBar loading={isLoading} />
            <div id="calendar-content">
                <NavBar currentPage={'calendar'} />
                <div id="calendar-main">
                    <ActionBar title="Calendar" />
                    <div id="calendar-main-content">
                        <Calendar
                            className="calendar-item"
                            cellRender={cellRender}
                            mode="month"
                            onSelect={(value, title) =>
                                title.source === 'date'
                                    ? setSelectedDay(value)
                                    : null
                            }
                        />
                        {selectedDay && (
                            <DayPopup
                                selectedDay={selectedDay}
                                tasks={getTasksOnCertainDay(selectedDay)}
                                onClose={() => setSelectedDay(null)}
                            />
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default CalendarPage
