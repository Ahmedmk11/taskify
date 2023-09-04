// --------------------------------------------------------------
// Home page frontend code.
// --------------------------------------------------------------

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import ActionBar from '../components/ActionBar'
import { useSearchParams } from 'react-router-dom'
import Card from '../components/Card'
import { Task } from '../../app/Task'
import Filter from '../components/Filter'
import { User } from '../../app/User'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { readUserDataFromDb } from '../../firebase'
import { parseDateFromString } from '../../app/Functions'
import Footer from '../components/Footer'

function Search() {
    const [isVisible, setIsVisible] = useState(false)
    const [searchParams] = useSearchParams()
    const query = searchParams.get('query')

    const [appliedFilters, setAppliedFilters] = useState({
        categoryFilter: null as string[] | null,
        dateFilter: null as Date[] | null,
        priorityFilter: null as string[] | null,
    })

    const [user, setUser] = useState(null as unknown as User)
    const [isLoading, setIsLoading] = useState(true)

    const [filteredTasks, setFilteredTasks] = useState<any[]>([])
    const [tasks, setTasks] = useState(user ? user.taskArray : [])

    async function fetchUserData() {
        const auth = getAuth()
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userData = await readUserDataFromDb(
                    getAuth().currentUser!.uid
                )
                setUser(userData!)
                setIsLoading(false)
                setTasks(userData!.taskArray)
                setFilteredTasks(userData!.taskArray)
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
        updateFilteredTasks()
    }, [appliedFilters])

    function updateFilteredTasks() {
        try {
            const cols = tasks.filter((task) => {
                const dueDate = parseDateFromString(task.dueDate)

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
        } catch (error) {}
    }

    const handleFiltersUpdate = (filters: any) => {
        setAppliedFilters(filters)
    }

    const getSearchResults = () => {
        return filteredTasks.filter((task) => {
            const titleMatch = task.title
                .toLowerCase()
                .includes(query!.toLowerCase())
            const descMatch = task.desc
                .toLowerCase()
                .includes(query!.toLowerCase())
            const categoriesMatch = task.categories.some((category: string) =>
                category.toLowerCase().includes(query!.toLowerCase())
            )
            return titleMatch || descMatch || categoriesMatch
        })
    }

    const showFilters = () => {
        document
            .getElementById('filters-container')
            ?.classList.toggle('show-filters')
        document
            .getElementById('filters-container')
            ?.classList.toggle('hide-filters')
        document
            .getElementById('filters-button-ab')
            ?.classList.toggle('filters-active')
    }

    return (
        <div id="search-body">
            <ToolBar />
            <div id="search-content">
                <NavBar />
                <div id="search-main">
                    <ActionBar
                        isHideButton={true}
                        isDisabled={
                            getSearchResults().length === 0 ? true : false
                        }
                        handleFilters={showFilters}
                        title={`${
                            getSearchResults().length === 0
                                ? 'No results found'
                                : `Found ${getSearchResults().length} result${
                                      getSearchResults().length === 1 ? '' : 's'
                                  }`
                        } for "${query}"`}
                    />
                    <div id="search-main-content">
                        <Filter
                            hideFilters={showFilters}
                            handleFiltersUpdate={handleFiltersUpdate}
                        />
                        <div id="result-items">
                            {getSearchResults()!.map((task) => (
                                <div className="draggable-card">
                                    <Card task={task} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Search
