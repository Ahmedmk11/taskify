// --------------------------------------------------------------
// Card react component.
// --------------------------------------------------------------

import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import {
    Button,
    Space,
    Input,
    DatePicker,
    Select,
    Skeleton,
    message,
    Menu,
    Dropdown,
    Modal,
} from 'antd'
import {
    PlusOutlined,
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
} from '@ant-design/icons'
import type { DatePickerProps, MenuProps } from 'antd'

import { v4 as uuidv4 } from 'uuid'

const { Option } = Select

import dateIcn from '../../assets/icons/date.svg'
import editIcn from '../../assets/icons/edit.svg'
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
} from '../../firebase'

import todoIcn from '../../assets/icons/todo.svg'
import inprogressIcn from '../../assets/icons/inprogress.svg'
import doneIcn from '../../assets/icons/done.svg'
import { parseDateFromString } from '../../app/Functions'
import dayjs from 'dayjs'
import EditCard from './EditCard'
import { EditCardContext } from './EditCardProvider'

type CardProps = {
    type: string
    task: Task | any
}

function Card(props: CardProps) {
    const { type, task } = props

    const [id, setId] = useState(task?.id ? task?.id : '')
    const [title, setTitle] = useState(task?.title ? task?.title : '')
    const [desc, setDesc] = useState(task?.desc ? task?.desc : '')
    const [categories, setCategories] = useState<string[]>(
        task?.categories ? task?.categories : []
    )
    const [dueDate, setDueDate] = useState(task?.dueDate ? task?.dueDate : '')
    const [priority, setPriority] = useState(
        task?.priority ? task?.priority : ''
    )
    const [status, setStatus] = useState(task?.status ? task?.status : '')

    const [user, setUser] = useState(null as unknown as User)
    let tasks = user ? user.taskArray : []
    const [userCategories, setUserCategories] = useState<string[]>([])

    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [categoryValidation, setCategoryValidation] = useState('')

    const [titleInput, setTitleInput] = useState('')
    const [descInput, setDescInput] = useState('')
    const [priorityInput, setPriorityInput] = useState('default')
    const [dateInput, setDateInput] = useState(formatDate(new Date()))
    const [inputValue, setInputValue] = useState('')

    const [isExpanded, setIsExpanded] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [fetchTimeout, setFetchTimeout] = useState(false)

    const [isEdit, setIsEdit] = useState(false)
    const [currentTaskSettings, setCurrentTaskSettings] = useState('')

    const { intermediateValues, setIntermediateValues } =
        useContext(EditCardContext)

    const [intermediateCategories, setIntermediateCategories] = useState(
        intermediateValues.categories
    )
    const [intermediateTitle, setIntermediateTitle] = useState(
        intermediateValues.title
    )
    const [intermediateDesc, setIntermediateDesc] = useState(
        intermediateValues.desc
    )
    const [intermediateDate, setIntermediateDate] = useState(
        intermediateValues.dueDate
    )
    const [intermediatePriority, setIntermediatePriority] = useState(
        intermediateValues.priority
    )

    useEffect(() => {
        setIntermediateCategories(intermediateValues.categories)
        setIntermediateTitle(intermediateValues.title)
        setIntermediateDesc(intermediateValues.desc)
        setIntermediateDate(intermediateValues.dueDate)
        setIntermediatePriority(intermediateValues.priority)
    }, [intermediateValues])

    const TodoIcon = () => (
        <img style={{ width: 18, height: 18 }} src={todoIcn} />
    )
    const InprogressIcon = () => (
        <img style={{ width: 18, height: 18 }} src={inprogressIcn} />
    )
    const DoneIcon = () => (
        <img style={{ width: 18, height: 18 }} src={doneIcn} />
    )

    const EditIcon = () => (
        <img
            style={{ width: 14, height: 14, marginRight: '8px' }}
            src={editIcn}
        />
    )

    const showModal = () => {
        setIsEdit(true)
    }

    const handleModalSave = async () => {
        const taskId = currentTaskSettings?.split('container-').pop() ?? ''
        const edittedTask = {
            id: taskId,
            title: intermediateTitle,
            desc: intermediateDesc,
            priority: intermediatePriority,
            dueDate: intermediateDate,
            categories: intermediateCategories,
        }
        await saveEditsToDB(edittedTask)
        setIsEdit(false)

        if (intermediateTitle) {
            setTitle(intermediateTitle)
        }

        if (intermediateDesc) {
            setDesc(intermediateDesc)
        }

        if (intermediateCategories[0]) {
            setCategories(intermediateCategories)
        }

        if (intermediateDate) {
            setDueDate(intermediateDate)
        }

        if (intermediatePriority) {
            setPriority(intermediatePriority)
        }

        const updatedArray = tasks.map((task) => {
            if (task.id === taskId) {
                if (intermediateTitle) {
                    task.title = intermediateTitle
                }

                if (intermediateDesc) {
                    task.desc = intermediateDesc
                }

                if (intermediateCategories[0]) {
                    task.categories = intermediateCategories
                }

                if (intermediateDate) {
                    task.dueDate = intermediateDate
                }

                if (intermediatePriority) {
                    task.priority = intermediatePriority
                }
            }
            return task
        })
        tasks = updatedArray
    }

    const handleModalCancel = () => {
        setIsEdit(false)
    }

    // const undoDelete = () => {
    //     message.destroy()
    // }

    const CustomMessage = () => (
        <div className="feedback-msg">Task Deleted.</div>
    )

    const showMessage = () => {
        message.open({
            content: <CustomMessage />,
            duration: 1.5,
        })
    }

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
        try {
            updateCurrentUserDocument('categories', userCategories)
        } catch (error) {
            console.log(error)
        }
    }, [userCategories])

    useEffect(() => {
        try {
            updateTaskCategories(id, selectedCategories)
        } catch (error) {
            console.log(error)
        }
    }, [selectedCategories])

    useEffect(() => {
        // Create a timer to set fetchTimeout to true after 50ms
        const timeoutId = setTimeout(() => {
            setFetchTimeout(true)
        }, 50)

        async function fetchData() {
            await fetchUserData()

            // If fetch completed within 50ms, cancel the timer and set isLoading to false
            if (!fetchTimeout) {
                clearTimeout(timeoutId)
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        if (fetchTimeout) {
            setIsLoading(true)
        }
    }, [fetchTimeout])

    useEffect(() => {
        if (user) {
            setUserCategories(user?.categories)
        }
    }, [user])

    const onDateInput: DatePickerProps['onChange'] = (value) => {
        const dateValue = value && value.toDate()
        setDateInput(formatDate(dateValue!))
    }

    function formatDate(date: Date) {
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }
        return new Intl.DateTimeFormat('en-GB', options).format(date)
    }

    function saveCard(ev: any) {
        const title = document.getElementById(
            'text-area-title'
        ) as HTMLTextAreaElement
        const desc = document.getElementById(
            'text-area-desc'
        ) as HTMLTextAreaElement
        const date = dateInput
        const formattedDate = date
        let flag = false
        if (title.value === '') {
            title.classList.add('error')
            flag = true
        }
        if (desc.value === '') {
            desc.classList.add('error')
            flag = true
        }
        if (formattedDate === null) {
            const date = document.getElementById('date-picker-ad')
            date!.classList.add('error')
            flag = true
        }
        if (priorityInput === null) {
            setPriorityInput('default')
        }
        if (flag) {
            return
        }

        const targetColumnID = ev.target.closest('.column').id
        let newStatus = ''
        switch (targetColumnID) {
            case 'col-1':
                newStatus = 'todo'
                break
            case 'col-2':
                newStatus = 'inprogress'
                break
            case 'col-3':
                newStatus = 'done'
                break
            default:
                newStatus = 'todo'
        }

        const genID: string = uuidv4()
        const newTask = new Task(
            `${genID}`,
            title.value,
            desc.value,
            priorityInput,
            date,
            newStatus
        )
        newTask.updateCategories(selectedCategories)
        addNewTaskToCurrentUser(newTask)
        // window.location.reload()
        Array.prototype.push.apply(userCategories, selectedCategories)
        cancelCard(ev)
    }

    function cancelCard(ev: any) {
        const container = ev.target.closest('#create-new-task')
        container.classList.remove('show-pop')
        container.classList.add('hide-pop')
        setTimeout(() => {
            container!.remove()
        }, 300)
    }

    const saveSettingsCardInfo = (ev: any) => {
        setCurrentTaskSettings(ev.target.closest('.draggable-card').id)
        console.log(currentTaskSettings)
        console.log(ev.target.closest('.draggable-card').id)
    }

    async function deleteCard() {
        console.log('idddd', id)
        const container = document.getElementById(currentTaskSettings)
        console.log(currentTaskSettings)
        container!.classList.remove('show-pop')
        container!.classList.add('hide-pop')
        setTimeout(() => {
            container!.remove()
        }, 300)
        showMessage()
        await deleteTaskFromUser(id)
        if (window.location.href.includes('task')) {
            window.location.href = '/'
        }
    }

    function editCard(): void {
        showModal()
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
        if (a) {
            a.style.height = 'auto'
            a.style.height = a.scrollHeight + 'px'
        }
    }

    function handleSelectChange(value: any, option: any): void {
        setSelectedCategories(value)
    }

    const handlePriorityChange = (value: any) => {
        setPriorityInput(value)
    }

    function handleCreateOption(value: string) {
        if (value.trim() === '') {
            setCategoryValidation('Invalid Input.')
            return
        }
        if (typeof value === 'string' && !userCategories.includes(value)) {
            setSelectedCategories([...selectedCategories, value])
            setUserCategories([...userCategories, value])
            setCategoryValidation('')
        } else if (userCategories.includes(value)) {
            setCategoryValidation('This category already exists.')
            return
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
            )}
            {categoryValidation !== '' ? (
                <p
                    style={{
                        color: 'red',
                        textAlign: 'center',
                        fontSize: '12px',
                        width: '200px',
                    }}
                >
                    {categoryValidation}
                </p>
            ) : null}
        </div>
    )

    const menu: MenuProps['items'] = [
        {
            label: (
                <a
                    onClick={editCard}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '100%',
                    }}
                    className="card-settings-cont"
                >
                    <EditIcon />
                    Edit
                </a>
            ),
            key: 'edit',
        },
        {
            label: (
                <a
                    onClick={deleteCard}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '100%',
                    }}
                    className="card-settings-cont"
                >
                    <DeleteOutlined style={{ marginRight: '8px' }} />
                    Delete
                </a>
            ),
            key: 'delete',
            danger: true,
        },
    ]

    return (
        <div
            className={isExpanded ? 'card expanded' : 'card'}
            id={type !== 'task' ? '' : id}
            style={
                type === 'task' &&
                (window.location.pathname == '/home' ||
                    window.location.pathname == '/')
                    ? { cursor: 'grab' }
                    : { cursor: 'default' }
            }
        >
            <div
                className={
                    type !== 'task'
                        ? `card-container ${priorityInput}-priority card-input`
                        : `card-container ${priority}-priority`
                }
            >
                {isLoading ? (
                    <Skeleton active></Skeleton>
                ) : (
                    <>
                        <div className="card-info-settings">
                            {
                                <div
                                    style={
                                        type !== 'task' ? { width: '100%' } : {}
                                    }
                                    className="card-categories"
                                >
                                    {type !== 'task' ? (
                                        <Select
                                            className="category-input"
                                            mode="multiple"
                                            placeholder="Select categories"
                                            dropdownRender={
                                                handleDropdownRender
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault()
                                                }
                                            }}
                                            value={selectedCategories}
                                            onChange={handleSelectChange}
                                            style={{ width: '100% !important' }}
                                        >
                                            {userCategories.map(
                                                (
                                                    category // here
                                                ) => (
                                                    <Option
                                                        key={category}
                                                        value={category}
                                                    >
                                                        {category}
                                                    </Option>
                                                )
                                            )}
                                        </Select>
                                    ) : categories.length > 0 ? (
                                        isExpanded ? (
                                            categories.map((category: any) => (
                                                <div
                                                    className="category no-pointer"
                                                    key={category}
                                                >
                                                    {category}
                                                </div>
                                            ))
                                        ) : (
                                            categories
                                                .slice(0, 2)
                                                .map((category: any) => (
                                                    <div
                                                        className="category no-pointer"
                                                        key={category}
                                                    >
                                                        {category}
                                                    </div>
                                                ))
                                        )
                                    ) : (
                                        <div className="category no-categories">
                                            No categories yet
                                        </div>
                                    )}
                                </div>
                            }

                            {type !== 'task' ? null : (
                                <div className="card-settings">
                                    <Dropdown
                                        menu={{ items: menu }}
                                        trigger={['click']}
                                    >
                                        <span>
                                            <EllipsisOutlined
                                                onClick={(e) => {
                                                    saveSettingsCardInfo(e)
                                                }}
                                                style={{ fontSize: '24px' }}
                                            />
                                        </span>
                                    </Dropdown>
                                </div>
                            )}
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
                                        value={titleInput}
                                        onChange={(e) => {
                                            setTitleInput(e.target.value)
                                        }}
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
                                        value={descInput}
                                        onChange={(e) => {
                                            setDescInput(e.target.value)
                                        }}
                                        rows={2}
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
                                            id="date-picker-ad"
                                            placeholder="Due date"
                                            style={{ width: 140 }}
                                            value={dayjs(
                                                parseDateFromString(dateInput)
                                            )}
                                            onChange={onDateInput}
                                        />
                                    </Space>
                                    <Select
                                        id="select-ad"
                                        placeholder="Priority"
                                        style={{ width: 140 }}
                                        value={priorityInput}
                                        onChange={handlePriorityChange}
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
                                        Due to: <span>{dueDate}</span>
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
                                        onClick={(e) => {
                                            saveCard(e)
                                        }}
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
                                    {status === 'todo' ? (
                                        <TodoIcon />
                                    ) : status === 'inprogress' ? (
                                        <InprogressIcon />
                                    ) : (
                                        <DoneIcon />
                                    )}
                                    <Button type="link">
                                        {isExpanded ? 'Read less' : 'Read more'}
                                    </Button>
                                </Space>
                            )}
                        </div>
                    </>
                )}
            </div>
            <Modal
                title="Edit Task"
                open={isEdit}
                onOk={handleModalSave}
                okText={'Save'}
                cancelButtonProps={{ danger: true }}
                onCancel={handleModalCancel}
                className="modal-item-input"
                destroyOnClose
            >
                <EditCard
                    task={tasks.find(
                        (task) =>
                            task.id ==
                            currentTaskSettings.split('container-').pop()
                    )}
                    type="modal"
                />
            </Modal>
        </div>
    )
}

Card.propTypes = {
    type: PropTypes.string,
    task: PropTypes.object as any,
}

Card.defaultProps = {
    type: 'task',
}

export default Card
