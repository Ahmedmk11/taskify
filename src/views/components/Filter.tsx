// --------------------------------------------------------------
// Filter react component.
// --------------------------------------------------------------

import React, { useState } from 'react'
import { Button, Space, DatePicker } from 'antd'
import PropTypes from 'prop-types'
import type { DatePickerProps } from 'antd'
const { RangePicker } = DatePicker;

import shownIcn from '../../assets/icons/shown.svg'
import hiddenIcn from '../../assets/icons/hidden.svg'

type FiltersProps = {
    categories: string[]
    hideFilters: () => void
    className: string
}

function Filter(props: FiltersProps) {
    const { categories, hideFilters, className } = props
    const [isStatusVisible, setIsStatusVisible] = useState(false)
    const [isCategoriesVisible, setIsCategoriesVisible] = useState(false)
    const [isDueDateVisible, setIsDueDateVisible] = useState(false)

    const [dateRange, setDateRange] = useState(null);
    const [isDueCleared, setIsDueCleared] = useState(false)
    
    const expandStatus = () => {
        setIsStatusVisible(!isStatusVisible)
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
        setIsDueCleared(false);
        setDateRange(dates);
    };

    const clearFilters = () => {
        const filterItems = document.querySelectorAll('.filter-item')
        filterItems.forEach((item) => {
            item.classList.remove('filter-selected')
        })
        setIsDueCleared(true);
        setDateRange(null);
        setIsStatusVisible(false)
        setIsDueDateVisible(false)
        setIsCategoriesVisible(false)
    }

    return (
        <div id='filters-container' className={className}>
            <div id='filters-header'>
                <p>Filters</p>
            </div>
            <div id='filters-content'>
                <div className="filter-item-container">
                    <div className='filter-item-header' onClick={expandCategory}>
                        <p>Categories</p>
                        <img
                        id="hide-show"
                        src={isCategoriesVisible ? shownIcn : hiddenIcn}
                        alt="Icon for hiding/showing the categories filter."
                        />
                    </div>
                    <div id="categories-sub" className={isCategoriesVisible ? 'show-class' : ''}>
                        {categories.map((category: string, index: number) => (
                        <div
                            className='filter-item'
                            id={`category-${index}`}
                            onClick={(e) => {
                                handleFilter(e)
                            }}
                            key={index}
                        >
                            <p>{category}</p>
                        </div>
                        ))}
                    </div>
                </div>
                <div id='due-date-filter-item-d' className="filter-item-container">
                    <div className='filter-item-header' onClick={expandDueDate}>
                        <p>Due Date</p>
                        <img
                        id="hide-show"
                        src={isDueDateVisible ? shownIcn : hiddenIcn}
                        alt="Icon for hiding/showing the categories filter."
                        />
                    </div>
                    <div id="due-sub" className={isDueDateVisible ? 'show-class' : ''}>
                        <Space direction="vertical">
                            <RangePicker id='date-filter-input' style={{width: 220}} 
                            value={
                                isDueCleared 
                                ? null 
                                : dateRange
                            }
                            onChange={handleDateChange} />
                        </Space>
                    </div>
                </div>
                <div className="filter-item-container">
                    <div className='filter-item-header' onClick={expandStatus}>
                        <p>Status</p>
                        <img
                            id="hide-show"
                            src={
                                isStatusVisible
                                ? shownIcn
                                : hiddenIcn
                            }
                            alt="Icon for hiding/showing the status filter."
                        />
                    </div>
                    <div id="status-sub" className={isStatusVisible ? 'show-class' : ''} >
                        <div className='filter-item' id="stat-1" 
                            onClick={(e) => {
                                handleFilter(e)
                            }} >
                            <p>
                                Todo
                            </p>
                        </div>
                        <div className='filter-item' id="stat-2" 
                            onClick={(e) => {
                                handleFilter(e)
                            }} >
                            <p>
                                In Progress
                            </p>
                        </div>
                        <div className='filter-item' id="stat-3" 
                            onClick={(e) => {
                                handleFilter(e)
                            }} >
                            <p>
                                Done
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div id='filter-buttons'>
                <Space wrap>
                    <Button className='filter-button' type='primary' id="apply-filters-btn">Apply</Button>
                </Space>
                <Space wrap>
                    <Button className='filter-button' onClick={clearFilters}>Clear</Button>
                </Space>
                <Space wrap>
                    <Button className='filter-button' onClick={ () => {
                        clearFilters()
                        hideFilters()
                    }} danger>Cancel</Button>
                </Space>
            </div>
        </div>
    )
}

Filter.propTypes = {
    categories: PropTypes.array.isRequired,
    hideFilters: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
}

Filter.defaultProps = {
    categories: ['Main'],
    hideFilters: () => {},
    className: '',
}

export default Filter
