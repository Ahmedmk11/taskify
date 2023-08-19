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
import { useNavigate } from 'react-router-dom'
import ReactDOM from 'react-dom'

type SearchProps = {
    tasks: Task[]
}

function Search(props: SearchProps) {
    const { tasks } = props
    const [isVisible, setIsVisible] = useState(false)
    const [searchParams] = useSearchParams()
    const query = searchParams.get('query')
    const navigate = useNavigate()

    useEffect(() => {
        document
            .getElementById('filters-container')
            ?.classList.add('visibility-hidden')
    }, [])

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

    const createCardPop = (col = 'col-1') => {
        const chk = document.getElementById('create-new-task')
        chk?.remove()
        const colEl = document.getElementById(col)
        const container = document.createElement('div')
        container.id = 'create-new-task'
        ReactDOM.render(<Card type="create" />, container)
        const cards = colEl!.querySelector('.cards')
        cards!.insertBefore(container, cards!.childNodes[0])
    }

    return (
        <div id="search-body">
            <ToolBar />
            <div id="search-content">
                <NavBar currentPage={'home'} />
                <div id="search-main">
                    <ActionBar
                        isSrch={true}
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
                        className={
                            isVisible
                                ? 'show-filter-container-srch'
                                : 'hide-filter-container-srch'
                        }
                    >
                        <Filter
                            className={isVisible ? '' : 'hide-filters'}
                            hideFilters={hideFilters}
                            categories={['Main', 'Work', 'UI Design']}
                        />
                        <div id="result-items">
                            {getSearchResults(tasks)!.map((task) => (
                                <Card
                                    key={task.id}
                                    categories={task.categories}
                                    title={task.title}
                                    description={task.desc}
                                    date={task.dueDate.toLocaleDateString(
                                        'en-GB',
                                        {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        }
                                    )}
                                    id={task.id}
                                    priority={task.priority}
                                />
                            ))}
                        </div>
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
}

export default Search
