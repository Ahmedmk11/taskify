// --------------------------------------------------------------
// Filter react component.
// --------------------------------------------------------------

import React, { useEffect, useState } from 'react'
import { Button, Space, DatePicker } from 'antd'
import PropTypes from 'prop-types'
const { RangePicker } = DatePicker

import shownIcn from '../../assets/icons/shown.svg'
import hiddenIcn from '../../assets/icons/hidden.svg'
import { User } from '../../app/User'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { readUserDataFromDb } from '../../firebase'
import dayjs from 'dayjs'
import { formatDate } from '../../app/Functions'

type FiltersData = {
    categoryFilter: any
    dateFilter: any
    priorityFilter: any
}

type FiltersProps = {
    hideFilters: () => void
    className: string
    handleFiltersUpdate: (filters: FiltersData) => void
}

function Filter(props: FiltersProps) {
    const { hideFilters, className } = props
    const [user, setUser] = useState(null as unknown as User)
    const tasks = user ? user.taskArray : []
    const [isLoading, setIsLoading] = useState(true)
    const [isPriorityVisible, setIsPriorityVisible] = useState(false)
    const [isCategoriesVisible, setIsCategoriesVisible] = useState(false)
    const [isDueDateVisible, setIsDueDateVisible] = useState(false)

    const [dateRange, setDateRange] = useState<any[] | null>(null)
    const [isDueCleared, setIsDueCleared] = useState(false)

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

    const expandPriority = () => {
        setIsPriorityVisible(!isPriorityVisible)
    }

    const expandCategory = () => {
        setIsCategoriesVisible(!isCategoriesVisible)
    }

    const expandDueDate = () => {
        setIsDueDateVisible(!isDueDateVisible)
    }

    const handleFilter = (e: any) => {
        e.target.closest('div').classList.toggle('filter-selected')
    }

    const handleDateChange = (dates: any) => {
        setIsDueCleared(false)
        setDateRange(dates)
    }

    const clearFilters = () => {
        const filterItems = document.querySelectorAll('.filter-item')
        filterItems.forEach((item) => {
            item.classList.remove('filter-selected')
        })
        setIsDueCleared(true)
        setDateRange(null)
        setIsPriorityVisible(false)
        setIsDueDateVisible(false)
        setIsCategoriesVisible(false)
    }

    const getAllFilters = () => {
        const filterItems = Array.from(
            document.querySelectorAll('.filter-item')
        )

        const categoryFilter = filterItems
            .filter(
                (filterItem) =>
                    filterItem.id.includes('category') &&
                    filterItem.classList.contains('filter-selected')
            )
            .map((filterItem) => filterItem.textContent)

        const priorityFilter = filterItems
            .filter(
                (filterItem) =>
                    filterItem.id.includes('priority') &&
                    filterItem.classList.contains('filter-selected')
            )
            .map((filterItem) => filterItem.textContent)

        let dateRangeFilter: any = []
        if (dateRange && Array.isArray(dateRange) && dateRange.length === 2) {
            const startDate = new Date(dateRange[0])
            const endDate = new Date(dateRange[1])
            dateRangeFilter = [startDate, endDate]
        }
        const filters: FiltersData = {
            categoryFilter: categoryFilter,
            dateFilter: dateRangeFilter,
            priorityFilter: priorityFilter,
        }

        props.handleFiltersUpdate(filters)
    }

    return (
        <div id="filters-container" className="hide-filters">
            <div id="filters-header">
                <p>Filters</p>
            </div>
            <div id="filters-content">
                <div className="filter-item-container">
                    <div
                        className="filter-item-header"
                        onClick={expandCategory}
                    >
                        <p>Categories</p>
                        <img
                            id="hide-show"
                            src={isCategoriesVisible ? shownIcn : hiddenIcn}
                            alt="Icon for hiding/showing the categories filter."
                        />
                    </div>
                    <div
                        id="categories-sub"
                        className={isCategoriesVisible ? 'show-class' : ''}
                    >
                        {user?.categories.map(
                            (category: string, index: number) => (
                                <div
                                    className="filter-item"
                                    id={`category-${index}`}
                                    onClick={(e) => {
                                        handleFilter(e)
                                    }}
                                    key={index}
                                >
                                    <p>{category}</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
                <div
                    id="due-date-filter-item-d"
                    className="filter-item-container"
                >
                    <div className="filter-item-header" onClick={expandDueDate}>
                        <p>Due Date</p>
                        <img
                            id="hide-show"
                            src={isDueDateVisible ? shownIcn : hiddenIcn}
                            alt="Icon for hiding/showing the categories filter."
                        />
                    </div>
                    <div
                        id="due-sub"
                        className={isDueDateVisible ? 'show-class' : ''}
                    >
                        <Space direction="vertical">
                            <RangePicker
                                id="date-filter-input"
                                style={{ width: 220 }}
                                value={
                                    isDueCleared
                                        ? null
                                        : [
                                              dateRange && dateRange[0]
                                                  ? dayjs(dateRange[0])
                                                  : null,
                                              dateRange && dateRange[1]
                                                  ? dayjs(dateRange[1])
                                                  : null,
                                          ]
                                }
                                onChange={handleDateChange}
                            />
                        </Space>
                    </div>
                </div>
                <div className="filter-item-container">
                    <div
                        className="filter-item-header"
                        onClick={expandPriority}
                    >
                        <p>Priority</p>
                        <img
                            id="hide-show"
                            src={isPriorityVisible ? shownIcn : hiddenIcn}
                            alt="Icon for hiding/showing the priority filter."
                        />
                    </div>
                    <div
                        id="priority-sub"
                        className={isPriorityVisible ? 'show-class' : ''}
                    >
                        <div
                            className="filter-item"
                            id="priority-1"
                            onClick={(e) => {
                                handleFilter(e)
                            }}
                        >
                            <p>Default</p>
                        </div>
                        <div
                            className="filter-item"
                            id="priority-2"
                            onClick={(e) => {
                                handleFilter(e)
                            }}
                        >
                            <p>Low</p>
                        </div>
                        <div
                            className="filter-item"
                            id="priority-3"
                            onClick={(e) => {
                                handleFilter(e)
                            }}
                        >
                            <p>Medium</p>
                        </div>
                        <div
                            className="filter-item"
                            id="priority-4"
                            onClick={(e) => {
                                handleFilter(e)
                            }}
                        >
                            <p>High</p>
                        </div>
                    </div>
                </div>
            </div>
            <div id="filter-buttons">
                <Space wrap>
                    <Button
                        className="filter-button"
                        type="primary"
                        id="apply-filters-btn"
                        onClick={() => {
                            getAllFilters()
                        }}
                    >
                        Apply
                    </Button>
                </Space>
                <Space wrap>
                    <Button className="filter-button" onClick={clearFilters}>
                        Clear
                    </Button>
                </Space>
                <Space wrap>
                    <Button
                        className="filter-button"
                        onClick={() => {
                            clearFilters()
                            hideFilters()
                        }}
                        danger
                    >
                        Cancel
                    </Button>
                </Space>
            </div>
        </div>
    )
}

Filter.propTypes = {
    hideFilters: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
}

Filter.defaultProps = {
    hideFilters: () => {},
    className: '',
}

export default Filter
