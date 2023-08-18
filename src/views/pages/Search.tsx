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

type SearchProps = {
    tasks: Task[]
}

function Search(props: SearchProps) {
    const { tasks } = props
    const [searchParams] = useSearchParams()
    const query = searchParams.get('query')

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

    return (
        <div id="search-body">
            <ToolBar />
            <div id="search-content">
                <NavBar currentPage={'home'} />
                <div id="search-main">
                    <ActionBar
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
                    <div id="search-main-content">
                        {getSearchResults(tasks).map((task) => (
                            <Card
                                categories={task.categories}
                                title={task.title}
                                description={task.desc}
                                date={task.dueDate.toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                                id={task.id}
                                priority={task.priority}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

Search.propTypes = {
    tasks: PropTypes.array.isRequired,
}

Search.defaultProps = {
    tasks: [
        {
            id: '1',
            title: 'Task 1',
            desc: 'This is a description for task 1.',
            categories: ['Main'],
            status: 'todo',
        },
        {
            id: '2',
            title: 'Task 2',
            desc: 'This is a description for task 2.',
            categories: ['Main'],
            status: 'todo',
        },
        {
            id: '3',
            title: 'hmm 3',
            desc: 'This is a description for 3.',
            categories: ['Main'],
            status: 'todo',
        },
    ],
}

export default Search
