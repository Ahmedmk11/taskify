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
import { readUserDataFromDb, signOutHandler } from '../../firebase'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { parseDateFromString } from '../../app/Functions'

type ToolBarProps = {
    loading?: boolean
}

function ToolBar(props: ToolBarProps) {
    const { loading } = props
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('theme') === 'dark' ? true : false
    )
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()

    const [user, setUser] = useState(null as unknown as User)
    const [isLoading, setIsLoading] = useState(loading)

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
            }
        })
    }

    useEffect(() => {
        async function fetchData() {
            await fetchUserData()
        }
        fetchData()
    }, [])

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

    const handleMenuClick = () => {
        setVisible(true)
    }

    const SunIcon = () => <img style={{ width: 16, height: 16 }} src={sunIcn} />
    const MoonIcon = () => (
        <img style={{ width: 16, height: 16 }} src={moonIcn} />
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
                        justifyContent: 'center',
                        width: '100%',
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
                <Space
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                    }}
                    direction="vertical"
                    onMouseEnter={(ev: any) => {
                        const closestLi = ev.target.closest('li')
                        closestLi.setAttribute(
                            'style',
                            'cursor: default; background-color: #fff'
                        )
                    }}
                >
                    <Switch
                        checkedChildren={<SunIcon />}
                        unCheckedChildren={<MoonIcon />}
                        defaultChecked={isDarkMode ? false : true}
                        onClick={handleMenuClick}
                        onChange={(checked) => {
                            setIsDarkMode(!checked)
                            localStorage.setItem(
                                'theme',
                                checked ? 'light' : 'dark'
                            )
                            if (checked) {
                                document.body.classList.add('light')
                                document.body.classList.remove('dark')
                            } else {
                                document.body.classList.add('dark')
                                document.body.classList.remove('light')
                            }
                        }}
                    />
                </Space>
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
                        justifyContent: 'center',
                        width: '100%',
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
                    <div>
                        <Dropdown
                            menu={{ items: notifs }}
                            trigger={['click']}
                            placement="bottomLeft"
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
                                            icon={<UserOutlined />}
                                            shape="square"
                                        />
                                    </Space>
                                </Space>
                            </a>
                        </Dropdown>
                        <p>Hello, {user?.name.split(' ')[0]}</p>
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
