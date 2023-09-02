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

function Search() {
    const [isVisible, setIsVisible] = useState(false)
    const [searchParams] = useSearchParams()
    const query = searchParams.get('query')

    const [appliedFilters, setAppliedFilters] = useState(null)

    const [user, setUser] = useState(null as unknown as User)
    const [isLoading, setIsLoading] = useState(true)
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

    const handleFiltersUpdate = (filters: any) => {
        setAppliedFilters(filters)
    }

    const getSearchResults = (tasks: Task[]) => {
        return tasks.filter((task) => {
            const titleMatch = task.title
                .toLowerCase()
                .includes(query!.toLowerCase())
            const descMatch = task.desc
                .toLowerCase()
                .includes(query!.toLowerCase())
            const categoriesMatch = task.categories.some((category) =>
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
                            getSearchResults(tasks).length === 0 ? true : false
                        }
                        handleFilters={showFilters}
                        title={`${
                            getSearchResults(tasks).length === 0
                                ? 'No results found'
                                : `Found ${
                                      getSearchResults(tasks).length
                                  } result${
                                      getSearchResults(tasks).length === 1
                                          ? ''
                                          : 's'
                                  }`
                        } for "${query}"`}
                    />
                    <div
                        id="search-main-content"
                    >
                        <Filter
                            hideFilters={showFilters}
                            handleFiltersUpdate={handleFiltersUpdate}
                        />
                        <div id="result-items">
                            {getSearchResults(tasks)!.map((task) => (
                                <div className="draggable-card">
                                    <Card task={task} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search
