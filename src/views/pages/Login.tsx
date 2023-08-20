// --------------------------------------------------------------
// Login page frontend code.
// --------------------------------------------------------------

import React, { useState } from 'react'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import Footer from '../components/Footer'
import { Button, Checkbox, Form, Input } from 'antd'
import {
    UserOutlined,
    LockOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
} from '@ant-design/icons'

function LoginPage() {
    const [visible, setVisible] = useState(false)

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values)
    }

    const handleToggleVisibility = () => {
        setVisible(!visible)
    }

    return (
        <div id="login-body">
            <ToolBar user={null} />
            <div id="login-content">
                <NavBar />
                <div id="login-main">
                    <div id="login-main-content">
                        <Form
                            name="normal_login"
                            className="login-form"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Username!',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={
                                        <UserOutlined className="site-form-item-icon" />
                                    }
                                    placeholder="Username"
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Password!',
                                    },
                                ]}
                            >
                                <Input.Password
                                    prefix={
                                        <LockOutlined className="site-form-item-icon" />
                                    }
                                    type="password"
                                    placeholder="Password"
                                    iconRender={(visible: any) =>
                                        visible ? (
                                            <EyeTwoTone
                                                onClick={handleToggleVisibility}
                                            />
                                        ) : (
                                            <EyeInvisibleOutlined
                                                onClick={handleToggleVisibility}
                                            />
                                        )
                                    }
                                />
                            </Form.Item>
                            <Form.Item>
                                <Form.Item
                                    name="remember"
                                    valuePropName="checked"
                                    noStyle
                                >
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>

                                <a className="login-form-forgot" href="">
                                    Forgot password
                                </a>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="login-form-button"
                                >
                                    Log in
                                </Button>
                                <div style={{ textAlign: 'center' }}>
                                    Don't have an account?
                                    <a href="/register"> Register</a>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default LoginPage
