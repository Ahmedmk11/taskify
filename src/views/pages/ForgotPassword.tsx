// --------------------------------------------------------------
// Forgot Password page frontend code.
// --------------------------------------------------------------

import React, { useState } from 'react'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import Footer from '../components/Footer'
import { Button, Form, Input } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { sendPasswordResetEmailHandler } from '../../firebase'
import { LeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

function ForgotPassword() {
    const [isSent, setIsSent] = useState(false)
    const navigate = useNavigate()

    const onFinish = (values: any) => {
        setIsSent(true)
        sendPasswordResetEmailHandler(values.email)
    }

    return (
        <div id="forgot-password-body">
            <ToolBar user={null} />
            <div id="forgot-password-content">
                <NavBar />
                <div id="forgot-password-main">
                    <div id="forgot-password-main-content">
                        {!isSent ? (
                            <Form
                                name="forgot-password-form"
                                className="forgot-password-form"
                                initialValues={{ remember: false }}
                                onFinish={onFinish}
                            >
                                <h2 style={{ textAlign: 'center' }}>
                                    Reset your password
                                </h2>
                                <Form.Item
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Enter the email associated with your account.',
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
                                <Form.Item style={{ marginBottom: '5px' }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="forgot-password-form-button"
                                    >
                                        Reset Password
                                    </Button>
                                    <div id="forgot-back-login-container">
                                        <div
                                            id="forgot-back-login"
                                            onClick={() => {
                                                navigate('/home')
                                            }}
                                        >
                                            <LeftOutlined />
                                            <p>Back to Login</p>
                                        </div>
                                    </div>
                                </Form.Item>
                            </Form>
                        ) : (
                            <form id="forgot-password-sent">
                                <h2 style={{ textAlign: 'center' }}>
                                    Reset your password
                                </h2>
                                <p
                                    style={{
                                        textAlign: 'center',
                                        fontSize: '14px',
                                    }}
                                >
                                    We've sent you an email with a link to reset
                                    your password.
                                </p>
                                <p
                                    style={{
                                        textAlign: 'center',
                                        fontSize: '14px',
                                    }}
                                >
                                    If you can't find the email, check your spam
                                    folder.
                                </p>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="forgot-password-form-button"
                                    onClick={() => {
                                        navigate('/home')
                                    }}
                                >
                                    Back to Login
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ForgotPassword
