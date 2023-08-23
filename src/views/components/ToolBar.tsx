// --------------------------------------------------------------
// Tool Bar react component.
// --------------------------------------------------------------

import React, { useEffect, useState } from 'react'

import notificationsIcn from '../../assets/icons/notifications.svg'
import logoIcn from '../../assets/icons/logo.svg'
import sunIcn from '../../assets/icons/sun.svg'
import moonIcn from '../../assets/icons/moon.svg'
import { User } from '../../app/User'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown, Space, Avatar, Switch, Menu } from 'antd'
import { useNavigate } from 'react-router-dom'
import { readUserDataFromDb, signOutHandler } from '../../firebase'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

function ToolBar() {
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('theme') === 'dark' ? true : false
    )
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()

    const [user, setUser] = useState(null as unknown as User)
    const [isLoading, setIsLoading] = useState(true)

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

    // if (isLoading) {
    //     return <div>Loading...</div>
    // }

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

    function getTasksDueInDays(user: User, days = 3) {
        const currentDate = new Date()
        const dueDate = new Date(currentDate)
        dueDate.setDate(dueDate.getDate() + days)
        const priorityOrder = { high: 1, medium: 2, low: 3, default: 4 }
        return tasks
            .filter((task) => task.dueDate < dueDate)
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

    function formatDate(date: Date) {
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }
        return new Intl.DateTimeFormat('en-GB', options).format(date)
    }

    const notifs: MenuProps['items'] = [
        {
            label: (
                <p id="notifs-p">
                    You have {getTasksDueInDays(user!)?.length ?? 0} tasks due
                    within the next 3 days
                </p>
            ),
            key: '0',
        },
        ...(getTasksDueInDays(user!)?.map((task, index) => ({
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
                            Due: <span>{formatDate(task.dueDate)}</span>
                        </div>
                    </div>
                    <div>
                        `Priority: $
                        {task.priority[0].toUpperCase() +
                            task.priority.slice(1)}
                        `
                    </div>
                </div>
            ),
            key: (index + 1).toString(),
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
                            placement="bottom"
                        >
                            <a onClick={(e) => e.preventDefault()}>
                                <img
                                    id="notification-img"
                                    src={notificationsIcn}
                                    alt="Icon for notificatons"
                                />
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
                                        />
                                    </Space>
                                </Space>
                            </a>
                        </Dropdown>
                        <p>Hello, {user?.name.split(' ')[0]}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ToolBar
