// --------------------------------------------------------------
// Tool Bar react component.
// --------------------------------------------------------------

import React, { useState } from 'react'
import PropTypes from 'prop-types'

import notificationsIcn from '../../assets/icons/notifications.svg'
import logoIcn from '../../assets/icons/logo.svg'
import sunIcn from '../../assets/icons/sun.svg'
import moonIcn from '../../assets/icons/moon.svg'
import { User } from '../../app/User'
import { UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown, Space, Avatar, Switch, Menu } from 'antd'
import { useNavigate } from 'react-router-dom'

type ToolBarProps = {
    user: User | null
}

const SunIcon = () => <img style={{ width: 16, height: 16 }} src={sunIcn} />
const MoonIcon = () => <img style={{ width: 16, height: 16 }} src={moonIcn} />

function ToolBar(props: ToolBarProps) {
    const { user } = props
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('theme') === 'dark' ? true : false
    )
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()

    const handleMenuClick = (ev: any) => {
        setVisible(true)
    }

    const handleVisibleChange = (flag: boolean) => {
        setVisible(flag)
    }

    function getTasksDueInDays(user: User, days = 3) {
        const currentDate = new Date();
        const dueDate = new Date(currentDate);
        dueDate.setDate(dueDate.getDate() + days);
        const priorityOrder = { high: 1, medium: 2, low: 3, default: 4 };
        return user.taskArray
          .filter(task => task.dueDate < dueDate)
          .sort((a, b) => {
            if (a.dueDate < b.dueDate) {
              return -1;
            } else if (a.dueDate > b.dueDate) {
              return 1;
            } else {
                return (
                    priorityOrder[a.priority as keyof typeof priorityOrder] -
                    priorityOrder[b.priority as keyof typeof priorityOrder]
                )
            }
          });
      }      

    function formatDate(date: Date) {
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          };
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    }

    const notifs = (
        <Menu id='notifs-menu'>
            <p>
                You have {getTasksDueInDays(user!).length} tasks due within less than 3 days
            </p>
          <Menu.Divider />
          {getTasksDueInDays(user!).map((task, index) => (
            <Menu.Item key={index + 1} onClick={() => {
                navigate('/task/' + task.id)
            }}>
                <div className='notif-item'>
                    <div>
                        <h3>
                            {task.title}
                        </h3>
                        <div>
                            Due: <span>{formatDate(task.dueDate)}</span>
                        </div>
                    </div>
                    <div>
                        Priority: {task.priority.split('')[0].toUpperCase() + task.priority.slice(1)}
                    </div>
                </div>
            </Menu.Item>
          ))}
        </Menu>
    );
      

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
                    Profile Settings
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
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                    }}
                >
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
            <div id="tool-bar-item">
                <div>
                    <Dropdown
                        overlay={notifs}
                        trigger={['click']}
                        placement="bottom"
                    >
                        <a onClick={(e) => e.preventDefault()}>
                            <img id='notification-img' src={notificationsIcn} alt="Icon for notificatons" />
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
                                    <Avatar size={32} icon={<UserOutlined />} />
                                </Space>
                            </Space>
                        </a>
                    </Dropdown>
                    <p>
                        Hello,{' '}
                        {user?.name.split(' ')[0]
                            ? user?.name.split(' ')[0]
                            : 'Guest'}
                    </p>
                </div>
            </div>
        </div>
    )
}

ToolBar.propTypes = {
    user: PropTypes.object,
}

ToolBar.defaultProps = {
    user: {
        name: 'Ahmed Mahmoud',
        email: 'ahmedmahmoud1903@outlook.com',
        taskArray: [
            {
                id: 1,
                title: 'Start dieting',
                desc: 'Task 1 description',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-08-22'),
                priority: 'medium',
                status: 'todo',
            },
            {
                id: 2,
                title: 'Finish this project',
                desc: 'Task 1 description',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-08-21'),
                priority: 'high',
                status: 'inprogress',
            },
            {
                id: 3,
                title: 'low priority task',
                desc: 'whatever',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-08-21'),
                priority: 'low',
                status: 'inprogress',
            },
            {
                id: 4,
                title: 'mid',
                desc: 'Task 1 description',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-08-21'),
                priority: 'medium',
                status: 'inprogress',
            },
            {
                id: 5,
                title: 'Task not due soon',
                desc: 'Task 1 description',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-09-20'),
                priority: 'high',
                status: 'inprogress',
            },
        ],
        inOrderTasks: [
            {
                id: 1,
                title: 'Start dieting',
                desc: 'Task 1 description',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-08-22'),
                priority: 'medium',
                status: 'todo',
            },
            {
                id: 2,
                title: 'Finish this project',
                desc: 'Task 1 description',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-08-21'),
                priority: 'high',
                status: 'inprogress',
            },
            {
                id: 3,
                title: 'low priority task',
                desc: 'whatever',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-08-21'),
                priority: 'low',
                status: 'inprogress',
            },
            {
                id: 4,
                title: 'mid',
                desc: 'Task 1 description',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-08-21'),
                priority: 'medium',
                status: 'inprogress',
            },
            {
                id: 5,
                title: 'Task not due soon',
                desc: 'Task 1 description',
                categories: ['Main', 'Work'],
                dueDate: new Date('2023-09-20'),
                priority: 'high',
                status: 'inprogress',
            },
        ],
        categories: ['Main', 'Work'],
    },
}

export default ToolBar
