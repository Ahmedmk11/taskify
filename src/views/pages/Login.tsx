// --------------------------------------------------------------
// Login page frontend code.
// --------------------------------------------------------------

import React, { useState } from 'react'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import Footer from '../components/Footer'
import { Button, Checkbox, Divider, Form, Input } from 'antd'
import {
    UserOutlined,
    LockOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
} from '@ant-design/icons'
import googleIcn from '../../assets/icons/google.svg'
import { signInHandler, signInWithGoogle } from '../../firebase'

function LoginPage() {
    const [visible, setVisible] = useState(false)
    const [isValid, setIsValid] = useState(true)

    const GoogleIcon = () => (
        <img style={{ width: 16, height: 16 }} src={googleIcn} />
    )

    const onFinish = async (values: any) => {
        const res = await signInHandler(values.email, values.password)
        setIsValid(res)
    }

    const handleToggleVisibility = () => {
        setVisible(!visible)
    }

    return (
        <div id="login-body">
            <ToolBar />
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
                            <h2 style={{ textAlign: 'center' }}>Login</h2>
                            <Form.Item
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your email!',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={
                                        <UserOutlined className="site-form-item-icon" />
                                    }
                                    placeholder="Email"
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
                            {!isValid && (
                                <p style={{ color: 'red' }}>
                                    Invalid email or password
                                </p>
                            )}
                            <Form.Item>
                                <Form.Item
                                    name="remember"
                                    valuePropName="checked"
                                    noStyle
                                >
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>

                                <a
                                    className="login-form-forgot"
                                    href="/reset-password"
                                >
                                    Forgot password
                                </a>
                            </Form.Item>

                            <Form.Item style={{ marginBottom: '5px' }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="login-form-button"
                                >
                                    Login
                                </Button>
                                <div style={{ textAlign: 'center' }}>
                                    Don't have an account?
                                    <a href="/register"> Register</a>
                                </div>
                            </Form.Item>
                            <Divider style={{ marginTop: '0px' }}>Or</Divider>
                            <div id="login-btn-container">
                                <Button
                                    icon={<GoogleIcon />}
                                    onClick={signInWithGoogle}
                                >
                                    Continue with Google
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default LoginPage
