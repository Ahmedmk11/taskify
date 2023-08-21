// --------------------------------------------------------------
// Card react component.
// --------------------------------------------------------------

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Space, Input, DatePicker, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { DatePickerProps } from 'antd'

const { Option } = Select

import settingsIcn from '../../assets/icons/settings.svg'
import dateIcn from '../../assets/icons/date.svg'
import { Task } from '../../app/Task'

type CardProps = {
    type: string
    task: Task
}

function Card(props: CardProps) {
    const { type, task } = props
    const { id, title, desc, categories, dueDate, priority, status } = task;
    const [selectedCategories, setSelectedCategories] = useState<string[]>(categories)
    const [inputValue, setInputValue] = useState('')
    const [isExpanded, setIsExpanded] = useState(false)

    const onDateInput: DatePickerProps['onChange'] = () => {}

    function formatDate(date: Date) {
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    }

    function cancelCard(ev: any) {
        const container = ev.target.closest('#create-new-task')
        container.classList.remove('show-pop')
        container.classList.add('hide-pop')
        setTimeout(() => {
            container!.remove()
        }, 300)
    }

    const expand = () => {
        setIsExpanded(!isExpanded)
        document.addEventListener('click', (ev: any) => {
            if (!ev.target.closest('.card')) {
                setIsExpanded(false)
            }
        })
    }

    function resizeTextarea(id: string) {
        var a = document.getElementById(id)
        a!.style.height = 'auto'
        a!.style.height = a!.scrollHeight + 'px'
    }

    useEffect(() => {
        let a = document.getElementsByTagName('textarea')
        for (var i = 0, inb = a.length; i < inb; i++) {
            if (a[i].getAttribute('data-resizable') == 'true')
                resizeTextarea(a[i].id)
        }
    }, [])

    function handleSelectChange(value: any, option: any): void {
        throw new Error('Function not implemented.')
    }

    const handlePriorityChange = (value: any) => {
        const input = document.getElementsByClassName('card-input')[0]
        const saveBtn = document.getElementById('save-input-btn')
        input.classList.remove(
            'default-priority',
            'low-priority',
            'medium-priority',
            'high-priority'
        )
        saveBtn!.classList.remove(
            'default-priority-btn',
            'low-priority-btn',
            'medium-priority-btn',
            'high-priority-btn'
        )
        switch (value) {
            case 'default':
                input.classList.add('default-priority')
                saveBtn!.classList.add('default-priority-btn')
                break
            case 'low':
                input.classList.add('low-priority')
                saveBtn!.classList.add('low-priority-btn')
                break
            case 'medium':
                input.classList.add('medium-priority')
                saveBtn!.classList.add('medium-priority-btn')
                break
            case 'high':
                input.classList.add('high-priority')
                saveBtn!.classList.add('high-priority-btn')
                break
            default:
                console.log('default')
                break
        }
    }

    function handleCreateOption(value: string) {
        if (typeof value === 'string') {
            console.log('Created:', value)
            setSelectedCategories([...selectedCategories, value])
        }
    }

    const handleDropdownRender = (menu: any) => (
        <div>
            {menu}
            {type !== 'task' && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: 8,
                    }}
                >
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onPressEnter={(e) => {
                            e.preventDefault()
                            handleCreateOption(inputValue)
                            setInputValue('')
                        }}
                        style={{ flex: 'auto' }}
                        placeholder="Enter new option"
                    />

                    <Button
                        type="link"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            handleCreateOption(inputValue)
                            setInputValue('')
                        }}
                    />
                </div>
            )}
        </div>
    )

    return (
        <div
            className={isExpanded ? 'card expanded' : 'card'}
            id={type !== 'task' ? '' : id}
        >
            <div
                className={
                    type !== 'task'
                        ? 'card-container card-input'
                        : `card-container ${priority}-priority`
                }
            >
                <div className="card-info-settings">
                    {
                        <div className="card-categories">
                            {type !== 'task' ? (
                                <Select
                                    className="category-input"
                                    mode="multiple"
                                    placeholder="Select options"
                                    onChange={handleSelectChange}
                                    dropdownRender={handleDropdownRender}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                        }
                                    }}
                                >
                                    {selectedCategories?.map((category) => (
                                        <Option key={category} value={category}>
                                            {category}
                                        </Option>
                                    ))}
                                </Select>
                            ) : (
                                categories
                                    .slice(1, categories.length)
                                    .map((category: any) => (
                                        <div
                                            className="category no-pointer"
                                            key={category}
                                        >
                                            {category}
                                        </div>
                                    ))
                            )}
                        </div>
                    }
                    <div className="card-settings">
                        {type !== 'task' ? null : (
                            <img src={settingsIcn} alt="Icon for settings" />
                        )}
                    </div>
                </div>
                <div className="card-body">
                    <div
                        className={
                            type !== 'task'
                                ? 'popup-newtask-title card-title'
                                : 'card-title'
                        }
                    >
                        {type !== 'task' ? (
                            <textarea
                                rows={1}
                                id="text-area-title"
                                className="textarea-new-task-title text-area-title"
                                placeholder="Title"
                                onKeyUp={resizeTextarea.bind(
                                    null,
                                    'text-area-title'
                                )}
                                data-resizable="true"
                                maxLength={50}
                            />
                        ) : (
                            title
                        )}
                    </div>
                    {type !== 'task' ? (
                        <div className="card-description">
                            <textarea
                                id="text-area-desc"
                                className="textarea-new-task-desc text-area-new-desc"
                                placeholder="Description"
                                onKeyUp={resizeTextarea.bind(
                                    null,
                                    'text-area-desc'
                                )}
                                data-resizable="true"
                            />
                        </div>
                    ) : (
                        <div className="card-description">{desc}</div>
                    )}
                </div>
                <div className="card-bottom">
                    {type !== 'task' ? (
                        <Space className="card-bottom-space">
                            <Space direction="vertical">
                                <DatePicker
                                    onChange={onDateInput}
                                    placeholder="Due date"
                                    style={{ width: 140 }}
                                />
                            </Space>
                            <Select
                                placeholder="Priority"
                                onChange={handlePriorityChange}
                                style={{ width: 140 }}
                            >
                                <Option value="default">Default</Option>
                                <Option value="low">Low</Option>
                                <Option value="medium">Medium</Option>
                                <Option value="high">High</Option>
                            </Select>
                        </Space>
                    ) : (
                        <div className="border">
                            <img src={dateIcn} alt="date icon" />
                            <p>
                                Due to: <span>{formatDate(dueDate)}</span>
                            </p>
                        </div>
                    )}
                </div>
                <div className="card-bottom-bottom">
                    {type !== 'task' ? (
                        <Space wrap>
                            <Button
                                onClick={(e) => {
                                    cancelCard(e)
                                }}
                                danger
                            >
                                Cancel
                            </Button>
                            <Button
                                className="default-priority-btn"
                                id="save-input-btn"
                            >
                                Save
                            </Button>
                        </Space>
                    ) : (
                        <Space
                            className="read-more"
                            onClick={() => {
                                type !== 'task' ? null : expand()
                            }}
                            wrap
                        >
                            <Button type="link">
                                {isExpanded ? 'Read less' : 'Read more'}
                            </Button>
                        </Space>
                    )}
                </div>
            </div>
        </div>
    )
}

Card.propTypes = {
    type: PropTypes.string,
    task: PropTypes.object,
}

Card.defaultProps = {
    type: 'task',
    task: {
        id: '1',
        title: 'Title',
        desc: 'Description',
        dueDate: new Date(),
        priority: 'default',
        categories: ['Category'],
    },
}

export default Card
