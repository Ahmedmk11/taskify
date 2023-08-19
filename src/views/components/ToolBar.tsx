// --------------------------------------------------------------
// Tool Bar react component.
// --------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'

import notificationsIcn from '../../assets/icons/notifications.svg'
import logoIcn from '../../assets/icons/logo.svg'
import { User } from '../../app/User'
import { UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown, Space, Avatar } from 'antd'
import { useNavigate } from 'react-router-dom'

type ToolBarProps = {
    user: User
}

function ToolBar(props: ToolBarProps) {
    const { user } = props
    const navigate = useNavigate()

    const items: MenuProps['items'] = [
        {
            label: <a onClick={() => {navigate('/profile')}}>Profile Settings</a>,
            key: '0',
        },
        {
            type: 'divider',
        },
        {
            label: <a>Log Out</a>,
            key: '1',
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
                    >
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <Space wrap size={32} id="profile-avi">
                                    <Avatar size={32} icon={<UserOutlined />} />
                                </Space>
                            </Space>
                        </a>
                    </Dropdown>
                    <p>Hello, {user.name.split(' ')[0]}</p>
                </div>
            </div>
        </div>
    )
}

ToolBar.propTypes = {
    user: PropTypes.object.isRequired,
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
