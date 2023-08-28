// --------------------------------------------------------------
// Card react component.
// --------------------------------------------------------------

import React, { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Space, Input, DatePicker, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { Option } = Select

import { Task } from '../../app/Task'
import { User } from '../../app/User'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
    addNewTaskToCurrentUser,
    deleteTaskFromUser,
    readUserDataFromDb,
    saveEditsToDB,
    updateCurrentUserDocument,
    updateTaskCategories,
    updateTasksArrayIds,
} from '../../firebase'

import { parseDateFromString } from '../../app/Functions'
import dayjs from 'dayjs'

import { EditCardContext } from './EditCardProvider'

type EditCardProps = {
    task: Task | any
}

function EditCard(props: EditCardProps) {
    const { task } = props

    const [user, setUser] = useState(null as unknown as User)
    const [userCategories, setUserCategories] = useState<string[]>([])

    const [inputValue, setInputValue] = useState('')
    const { intermediateValues, setIntermediateValues } =
        useContext(EditCardContext)

    const [intermediateCategories, setIntermediateCategories] = useState(
        task.categories
    )
    const [intermediateTitle, setIntermediateTitle] = useState(task.title)
    const [intermediateDesc, setIntermediateDesc] = useState(task.desc)
    const [intermediateDate, setIntermediateDate] = useState(task.dueDate)
    const [intermediatePriority, setIntermediatePriority] = useState(
        task.priority
    )

    useEffect(() => {
        setIntermediateCategories(task?.categories)
        setIntermediateTitle(task?.title)
        setIntermediateDesc(task?.desc)
        setIntermediateDate(task?.dueDate)
        setIntermediatePriority(task?.priority)
        console.log('intermodal', intermediateTitle)
    }, [task])

    async function fetchUserData() {
        const auth = getAuth()
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userData = await readUserDataFromDb(
                    getAuth().currentUser!.uid
                )
                setUser(userData!)
            }
        })
    }

    useEffect(() => {
        try {
            console.log('userCategories before update', userCategories)
            updateCurrentUserDocument('categories', userCategories)
        } catch (error) {
            console.log(error)
        }
    }, [userCategories])

    useEffect(() => {
        async function fetchData() {
            await fetchUserData()
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (user) {
            setUserCategories(user?.categories)
        }
    }, [user])

    function formatDate(date: Date) {
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }
        return new Intl.DateTimeFormat('en-GB', options).format(date)
    }

    // if (isLoading && type == 'task') {
    //     return <Skeleton />
    // }

    function resizeTextarea(id: string) {
        var a = document.getElementById(id)
        if (a) {
            a.style.height = 'auto'
            a.style.height = a.scrollHeight + 'px'
        }
    }

    function handleCreateOption(value: string) {
        if (typeof value === 'string') {
            console.log('Created new user category:', value)
            setIntermediateCategories([...intermediateCategories, value])
            setUserCategories([...userCategories, value])
        }
    }

    const handleDropdownRender = (menu: any) => (
        <div>
            {menu}
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
                    placeholder="Add a new category"
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
        </div>
    )

    function handleEditCategories(value: any): void {
        setIntermediateCategories(value)
        const updatedIntermediateValues = {
            ...intermediateValues,
            categories: value,
        }
        setIntermediateValues(updatedIntermediateValues)
    }
    function handleEditTitle(value: string): void {
        setIntermediateTitle(value)
        const updatedIntermediateValues = {
            ...intermediateValues,
            title: value,
        }
        setIntermediateValues(updatedIntermediateValues)
    }
    function handleEditDesc(value: string): void {
        setIntermediateDesc(value)
        const updatedIntermediateValues = {
            ...intermediateValues,
            desc: value,
        }
        setIntermediateValues(updatedIntermediateValues)
    }
    function handleEditDate(value: string): void {
        setIntermediateDate(value)
        const updatedIntermediateValues = {
            ...intermediateValues,
            dueDate: value,
        }
        setIntermediateValues(updatedIntermediateValues)
    }
    function handleEditPriority(value: string): void {
        setIntermediatePriority(value)
        const updatedIntermediateValues = {
            ...intermediateValues,
            priority: value,
        }
        setIntermediateValues(updatedIntermediateValues)
    }

    return (
        <div className="card" style={{ cursor: 'default' }}>
            <div className={'card-container card-input'}>
                <div className="card-info-settings">
                    {
                        <div className="card-categories">
                            <Select
                                className="category-input"
                                mode="multiple"
                                placeholder="Select categories"
                                dropdownRender={handleDropdownRender}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                    }
                                }}
                                value={intermediateCategories}
                                onChange={handleEditCategories}
                            >
                                {userCategories.map(
                                    (
                                        category // here
                                    ) => (
                                        <Option key={category} value={category}>
                                            {category}
                                        </Option>
                                    )
                                )}
                            </Select>
                        </div>
                    }
                    <div className="card-settings"></div>
                </div>
                <div className="card-body">
                    <div className={'popup-newtask-title card-title'}>
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
                            value={intermediateTitle}
                            onChange={(e) => {
                                handleEditTitle(e.target.value)
                            }}
                        />
                    </div>
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
                            value={intermediateDesc}
                            onChange={(e) => {
                                handleEditDesc(e.target.value)
                            }}
                            rows={8}
                        />
                    </div>
                </div>
                <div className="card-bottom">
                    <Space className="card-bottom-space">
                        <Space direction="vertical">
                            <DatePicker
                                id="date-picker-ad"
                                placeholder="Due date"
                                style={{ width: 140 }}
                                value={dayjs(
                                    parseDateFromString(intermediateDate)
                                )}
                                onChange={(newDate) => {
                                    handleEditDate(
                                        formatDate(newDate!.toDate())
                                    )
                                }}
                            />
                        </Space>
                        <Select
                            id="select-ad"
                            placeholder="Priority"
                            style={{ width: 140 }}
                            value={intermediatePriority}
                            onChange={(v) => {
                                handleEditPriority(v)
                            }}
                        >
                            <Option value="default">Default</Option>
                            <Option value="low">Low</Option>
                            <Option value="medium">Medium</Option>
                            <Option value="high">High</Option>
                        </Select>
                    </Space>
                </div>
            </div>
        </div>
    )
}

EditCard.propTypes = {
    type: PropTypes.string,
    task: PropTypes.object as any,
}

export default EditCard
