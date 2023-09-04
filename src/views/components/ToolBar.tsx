// --------------------------------------------------------------
// Tool Bar react component.
// --------------------------------------------------------------

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import notificationsIcn from '../../assets/icons/notifications.svg'
import logoIcn from '../../assets/icons/logo.svg'
import sunIcn from '../../assets/icons/sun.svg'
import moonIcn from '../../assets/icons/moon.svg'
import { User } from '../../app/User'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown, Space, Avatar, Switch, Divider, Skeleton, Badge } from 'antd'
import { useNavigate } from 'react-router-dom'
import { db, readUserDataFromDb, signOutHandler } from '../../firebase'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { parseDateFromString } from '../../app/Functions'
import { doc, onSnapshot } from 'firebase/firestore'

type ToolBarProps = {
    loading?: boolean
}

function ToolBar(props: ToolBarProps) {
    const { loading } = props
    const [themeMode, setThemeMode] = useState(
        localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light'
    )
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()

    const [user, setUser] = useState(null as unknown as User)
    const [isLoading, setIsLoading] = useState(loading)

    const [firstName, setFirstName] = useState('Guest')

    const tasks = user?.taskArray ?? []

    async function fetchUserData() {
        const auth = getAuth()
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userData = await readUserDataFromDb(
                    getAuth().currentUser!.uid
                )
                setUser(userData!)
                setIsLoading(false)
                setFirstName(userData!.name.split(' ')[0])
            }
        })
    }

    useEffect(() => {
        console.log(firstName)
    }, [firstName])

    useEffect(() => {
        async function fetchData() {
            await fetchUserData()
        }
        async function updateNameUI() {
            try {
                const currentUser = getAuth().currentUser
                if (currentUser) {
                    const userUID = currentUser.uid
                    const userDocRef = doc(db, 'users', userUID)
                    onSnapshot(userDocRef, async (docSnapshot) => {
                        if (docSnapshot.exists()) {
                            const userData = docSnapshot.data()
                            if (userData) {
                                const updatedName = userData.displayName
                                setFirstName(updatedName.split(' ')[0])
                            }
                        }
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
        updateNameUI()

        if (themeMode === 'dark') {
            document.body.classList.add('dark')
            document.body.classList.remove('light')
        } else {
            document.body.classList.add('light')
            document.body.classList.remove('dark')
        }

        // Make sure the theme mode is stored in localStorage
        if (!localStorage.getItem('theme')) {
            localStorage.setItem('theme', themeMode!)
        }
    }, [])

    useEffect(() => {
        console.log(themeMode)
    }, [themeMode])

    useEffect(() => {
        const hideFiltersContainer = () => {
            const filtersContainer =
                document.getElementById('filters-container')
            if (filtersContainer) {
                filtersContainer.classList.add('visibility-hidden')
            }
        }
        hideFiltersContainer()
    }, [user])

    const SunIcon = () => (
        <img
            style={{ marginRight: '8px', width: 16, height: 16 }}
            src={sunIcn}
        />
    )
    const MoonIcon = () => (
        <img
            style={{ marginRight: '8px', width: 16, height: 16 }}
            src={moonIcn}
        />
    )

    const handleVisibleChange = (flag: boolean) => {
        setVisible(flag)
    }
    function getTasksDueInDays(days = 3) {
        const currentDate = new Date()
        const dueDate = new Date(currentDate)
        dueDate.setDate(currentDate.getDate() + days)

        const priorityOrder = { high: 1, medium: 2, low: 3, default: 4 }

        return tasks
            .filter((task) => {
                const taskDueDate = parseDateFromString(task.dueDate)
                return (
                    taskDueDate > currentDate &&
                    taskDueDate <= dueDate &&
                    task.status !== 'done'
                )
            })
            .sort((a, b) => {
                if (a.dueDate < b.dueDate) {
                    return -1
                } else if (a.dueDate > b.dueDate) {
                    return 1
                } else {
                    return (
                        priorityOrder[
                            a.priority as keyof typeof priorityOrder
                        ] -
                        priorityOrder[b.priority as keyof typeof priorityOrder]
                    )
                }
            })
    }

    function getOverDueTasks() {
        const currentDate = new Date()

        const priorityOrder = { high: 1, medium: 2, low: 3, default: 4 }

        return tasks
            .filter((task) => {
                const taskDueDate = parseDateFromString(task.dueDate)
                return taskDueDate < currentDate && task.status !== 'done'
            })
            .sort((a, b) => {
                if (a.dueDate < b.dueDate) {
                    return -1
                } else if (a.dueDate > b.dueDate) {
                    return 1
                } else {
                    return (
                        priorityOrder[
                            a.priority as keyof typeof priorityOrder
                        ] -
                        priorityOrder[b.priority as keyof typeof priorityOrder]
                    )
                }
            })
    }

    const notifs: MenuProps['items'] = [
        {
            label: (
                <>
                    <p id="notifs-p">
                        You have {getTasksDueInDays()?.length ?? 0} tasks due
                        within the next 3 days.
                    </p>
                    <Divider style={{ margin: '0' }} />
                </>
            ),
            key: 'tasksDue',
        },
        ...(getTasksDueInDays()?.map((task, index) => ({
            label: (
                <div
                    className="notif-item"
                    onClick={() => {
                        navigate('/task/' + task.id)
                    }}
                >
                    <div>
                        <h3>{task.title}</h3>
                        <div>
                            Due: <span>{task.dueDate}</span>
                        </div>
                    </div>
                    <div>
                        Priority: &nbsp;
                        {task.priority[0].toUpperCase() +
                            task.priority.slice(1)}
                    </div>
                </div>
            ),
            key: 'taskDue-' + task.id,
        })) ?? []),
        {
            label: (
                <>
                    <p id="notifs-p">
                        You have {getOverDueTasks()?.length ?? 0} overdue tasks.
                    </p>
                    <Divider style={{ margin: '0' }} />
                </>
            ),
            key: 'overdueTasks',
        },
        ...(getOverDueTasks()?.map((task, index) => ({
            label: (
                <div
                    className="notif-item"
                    onClick={() => {
                        navigate('/task/' + task.id)
                    }}
                >
                    <div>
                        <h3>{task.title}</h3>
                        <div>
                            Due: <span>{task.dueDate}</span>
                        </div>
                    </div>
                    <div>
                        Priority: &nbsp;
                        {task.priority[0].toUpperCase() +
                            task.priority.slice(1)}
                    </div>
                </div>
            ),
            key: 'overdueTask-' + task.id,
        })) ?? []),
    ]

    const items: MenuProps['items'] = [
        {
            label: (
                <a
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '100%',
                        userSelect: 'none',
                    }}
                    onClick={() => {
                        navigate('/profile')
                    }}
                >
                    <UserOutlined style={{ marginRight: '8px' }} />
                    Profile
                </a>
            ),
            key: '0',
        },
        {
            label: (
                <a
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '100%',
                        userSelect: 'none',
                    }}
                    onClick={() => {
                        if (themeMode === 'light') {
                            document.body.classList.remove('light')
                            document.body.classList.add('dark')
                        } else {
                            document.body.classList.remove('dark')
                            document.body.classList.add('light')
                        }
                        const newThemeMode =
                            themeMode === 'light' ? 'dark' : 'light'
                        setThemeMode(newThemeMode)
                        localStorage.setItem('theme', newThemeMode)
                    }}
                >
                    {themeMode === 'light' ? (
                        <>
                            <SunIcon />
                            Light
                        </>
                    ) : (
                        <>
                            <MoonIcon />
                            Dark
                        </>
                    )}
                </a>
            ),
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: (
                <a
                    onClick={signOutHandler}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '100%',
                        userSelect: 'none',
                    }}
                >
                    <LogoutOutlined style={{ marginRight: '8px' }} />
                    Log Out
                </a>
            ),
            key: '2',
            danger: true,
        },
    ]

    return (
        <div id="tool-bar">
            <div id="tool-bar-header">
                <img
                    src={logoIcn}
                    alt="logo"
                    onClick={() => {
                        navigate('/home')
                    }}
                />
            </div>
            {user && (
                <div id="tool-bar-item">
                    <div id="notif-container">
                        <Dropdown
                            menu={{ items: notifs }}
                            trigger={['click']}
                            placement="bottomLeft"
                            className="notifs-drpdwn" // fix this
                        >
                            <a onClick={(e) => e.preventDefault()}>
                                <Space size="middle">
                                    <Badge
                                        count={
                                            getOverDueTasks().length +
                                            getTasksDueInDays().length
                                        }
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            id="notification-img"
                                            src={notificationsIcn}
                                            alt="Icon for notificatons"
                                        />
                                    </Badge>
                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                    <div id="tool-bar-profile">
                        <Dropdown
                            menu={{ items }}
                            trigger={['click']}
                            placement="bottom"
                            onOpenChange={handleVisibleChange}
                            open={visible}
                        >
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <Space wrap size={32} id="profile-avi">
                                        <Avatar
                                            size={32}
                                            icon={firstName.trim().charAt(0)}
                                            shape="circle"
                                        />
                                    </Space>
                                </Space>
                            </a>
                        </Dropdown>
                        <p>Hello, {firstName}</p>
                    </div>
                </div>
            )}
            {isLoading ? (
                <div
                    style={{
                        width: '100px',
                        height: '100px',
                        marginRight: '100px',
                    }}
                    id="tool-bar-profile"
                >
                    <Skeleton.Avatar style={{ marginRight: '20px' }} />
                    <Skeleton.Input block active />
                </div>
            ) : null}
        </div>
    )
}

ToolBar.propTypes = {
    loading: PropTypes.bool,
}

ToolBar.defaultProps = {
    loading: false,
}

export default ToolBar
