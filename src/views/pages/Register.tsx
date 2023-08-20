// --------------------------------------------------------------
// Register page frontend code.
// --------------------------------------------------------------

import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import Footer from '../components/Footer'
import React, { useState } from 'react'
import {
    Button,
    Checkbox,
    Col,
    Form,
    Input,
    Row,
} from 'antd'
import ReCAPTCHA from 'react-google-recaptcha'

const RECAPTCHA_SITE_KEY = '6LfXeb4nAAAAAFxeH46IPLGhwGEq3uw9M2h1IyxE';

function onSubmit(token: any) {
    const form = document.getElementById("demo-form")! as HTMLFormElement;
    form.submit();
}

function Register() {
    const [form] = Form.useForm()
    const [captchaValue, setCaptchaValue] = useState(null);
    const handleCaptchaChange = (value: any) => {
        setCaptchaValue(value);
    };
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    }

    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 16,
                offset: 8,
            },
        },
    }

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values)
    }

    return (
        <div id="register-body">
            <ToolBar />
            <div id="register-content">
                <NavBar />
                <div id="register-main">
                    <div id="register-main-content">
                        <Form
                            {...formItemLayout}
                            form={form}
                            name="register"
                            onFinish={onFinish}
                            style={{ maxWidth: 600 }}
                            scrollToFirstError
                        >
                            <Form.Item
                                name="fullname"
                                label="Full Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your full name!',
                                        whitespace: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="E-mail"
                                rules={[
                                    {
                                        type: 'email',
                                        message:
                                            'The input is not valid E-mail!',
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                name="confirm"
                                label="Confirm Password"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please confirm your password!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (
                                                !value ||
                                                getFieldValue('password') ===
                                                    value
                                            ) {
                                                return Promise.resolve()
                                            }
                                            return Promise.reject(
                                                new Error(
                                                    'The new password that you entered do not match!'
                                                )
                                            )
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                name="agreement"
                                valuePropName="checked"
                                rules={[
                                    {
                                        validator: (_, value) =>
                                            value
                                                ? Promise.resolve()
                                                : Promise.reject(
                                                      new Error(
                                                          'Should accept agreement'
                                                      )
                                                  ),
                                    },
                                ]}
                                {...tailFormItemLayout}
                            >
                                <Checkbox>
                                    I have read the <a href="">agreement</a>
                                </Checkbox>
                            </Form.Item>
                            <Form.Item {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">
                                    Register
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Register
