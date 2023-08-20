// --------------------------------------------------------------
// Tool Bar react component.
// --------------------------------------------------------------

import React, { useState} from 'react'
import PropTypes from 'prop-types'

import notificationsIcn from '../../assets/icons/notifications.svg'
import logoIcn from '../../assets/icons/logo.svg'
import sunIcn from '../../assets/icons/sun.svg'
import moonIcn from '../../assets/icons/moon.svg'
import { User } from '../../app/User'
import { UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown, Space, Avatar, Switch } from 'antd'
import { useNavigate } from 'react-router-dom'

type ToolBarProps = {
    user: User | null
}

const SunIcon = () => <img style={{width: 16, height: 16}} src={sunIcn} />
const MoonIcon = () => <img style={{width: 16, height: 16}} src={moonIcn} />

function ToolBar(props: ToolBarProps) {
    const { user } = props
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark' ? true : false)
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()

    const handleMenuClick = (ev: any) => {
        setVisible(true);
    }

    const handleVisibleChange = (flag: boolean) => {
        setVisible(flag);
    };

    const items: MenuProps['items'] = [
        {
            label: (
                <a style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
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
                    <Space style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }} direction="vertical">
                        <Switch
                        checkedChildren={<SunIcon />}
                        unCheckedChildren={<MoonIcon />}
                        defaultChecked={isDarkMode ? false : true}
                        onClick={handleMenuClick}
                        onChange={(checked) => {
                            setIsDarkMode(!checked)
                            localStorage.setItem('theme', checked ? 'light' : 'dark')
                            if (checked) {
                                document.body.classList.add('light')
                                document.body.classList.remove('dark')
                            } else {
                                document.body.classList.add('dark')
                                document.body.classList.remove('light')
                            }
                        }} />
                    </Space>
            ),
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: <a style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
            }}>Log Out</a>,
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
                <img src={notificationsIcn} alt="Icon for notificatons" />
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
                title: 'Task 1',
                desc: 'Task 1 description',
                categories: ['Main', 'Work'],
                dueDate: new Date('2020-10-10'),
                priority: 'high',
                status: 'inprogress',
            },
        ],
        inOrderTasks: [
            {
                id: 1,
                title: 'Task 1',
                desc: 'Task 1 description',
                categories: ['Main', 'Work'],
                dueDate: new Date('2020-10-10'),
                priority: 'high',
                status: 'inprogress',
            },
        ],
        categories: ['Main', 'Work'],
    },
}

export default ToolBar
