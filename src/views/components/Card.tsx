// --------------------------------------------------------------
// Card react component.
// --------------------------------------------------------------

import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import {
    Button,
    Space,
    Input,
    DatePicker,
    Select,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { DatePickerProps } from 'antd'

const { Option } = Select

import settingsIcn from '../../assets/icons/settings.svg'
import dateIcn from '../../assets/icons/date.svg'

type CardProps = {
    categories: string[]
    title: string
    description: string
    date: string
    type: string
}

function Card(props: CardProps) {
    const { categories, title, description, date, type } = props
    const [selectedCategories, setSelectedCategories] =
        React.useState<string[]>(categories)
    const [inputValue, setInputValue] = React.useState('')

    const onDateInput: DatePickerProps['onChange'] = () => {}

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
        <div id="card">
            <div id="card-container" className={type !== 'task' ? 'card-input' : ''}>
                <div id="card-info-settings">
                    {
                        <div id="card-categories">
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
                                    {selectedCategories.map((category) => (
                                        <Option key={category} value={category}>
                                            {category}
                                        </Option>
                                    ))}
                                </Select>
                            ) : (
                                <div className="category pointer">category</div>
                            )}
                        </div>
                    }
                    <div id="card-settings">
                        {type !== 'task' ? null : (
                            <img src={settingsIcn} alt="Icon for settings" />
                        )}
                    </div>
                </div>
                <div id="card-body">
                    <div
                        id="card-title"
                        className={
                            type !== 'task'
                                ? 'popup-newtask-title'
                                : 'card-title'
                        }
                    >
                        {type !== 'task' ? (
                            <textarea
                                rows={1}
                                id="text-area-title"
                                className="textarea-new-task-title"
                                placeholder="Title"
                                onKeyUp={resizeTextarea.bind(
                                    null,
                                    'text-area-title'
                                )}
                                data-resizable="true"
                            />
                        ) : (
                            title
                        )}
                    </div>
                    {type !== 'task' ? (
                        <div id="card-description">
                            <textarea
                                id="text-area-desc"
                                className="textarea-new-task-desc"
                                placeholder="Description"
                                onKeyUp={resizeTextarea.bind(
                                    null,
                                    'text-area-desc'
                                )}
                                data-resizable="true"
                            />
                        </div>
                    ) : (
                        <div id="card-description">{description}</div>
                    )}
                </div>
                <div id="card-bottom">
                    {type !== 'task' ? (
                        <Space id='card-bottom-space'>
                            <Space direction="vertical">
                                <DatePicker onChange={onDateInput} placeholder='Due date' />
                            </Space>
                            <Select
                                placeholder="Priority"
                                onChange={handlePriorityChange}>
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
                                Due to: <span>16 May</span>
                            </p>
                        </div>
                    )}
                </div>
                {type !== 'task' && (
                    <div className="card-bottom-bottom">
                        <Space wrap>
                            <Button>Cancel</Button>
                            <Button id='save-input-btn'>Save</Button>
                        </Space>
                    </div>
                )}
            </div>
        </div>
    )
}

Card.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.string),
    class: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    date: PropTypes.string,
    type: PropTypes.string,
}

Card.defaultProps = {
    categories: ['Main', 'Work'],
    title: 'Finish Website',
    description: 'Finish the website by the end of the week.',
    date: '18/08/2023',
    type: 'task',
}

export default Card
