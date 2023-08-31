// --------------------------------------------------------------
// ProfileSettings page frontend code.
// --------------------------------------------------------------

import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import Footer from '../components/Footer'
import { User } from '../../app/User'
import {
    EmailAuthProvider,
    getAuth,
    onAuthStateChanged,
    reauthenticateWithCredential,
} from 'firebase/auth'
import {
    deleteUserFromFirebase,
    readUserDataFromDb,
    updateUserEmail,
    updateUserName,
    updateUserPassword,
} from '../../firebase'
import { Button, Form, Input, Modal, Skeleton } from 'antd'
import ActionBar from '../components/ActionBar'

function ProfileSettings() {
    const [form] = Form.useForm()
    const [user, setUser] = useState(null as unknown as User)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditProfile, setIsEditProfile] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [isEditPassword, setIsEditPassword] = useState(false)
    const [isDeleteModal, setIsDeleteModal] = useState(false)
    const [validation, setValidation] = useState('')
    const [validationStatus, setValidationStatus] = useState(true)

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
        const hideFiltersContainer = () => {
            const filtersContainer =
                document.getElementById('filters-container')
            if (filtersContainer) {
                filtersContainer.classList.add('visibility-hidden')
            }
        }
        hideFiltersContainer()
        if (user) {
            setFirstName(user.name.split(' ')[0])
            setLastName(user.name.split(' ')[1])
            setEmail(user.email)
        }
    }, [user])

    useEffect(() => {
        async function fetchData() {
            await fetchUserData()
        }
        fetchData()
    }, [])

    function editProfile() {
        setIsEditProfile(true)
    }

    function deleteAccount(ev: any) {
        setIsDeleteModal(true)
    }

    function changePassword(ev: any) {
        setIsEditPassword(true)
    }

    function handleValidation(ev: any) {
        setValidation(ev.target.value)
    }

    function cancelEditProfile() {
        setFirstName(user.name.split(' ')[0])
        setLastName(user.name.split(' ')[1])
        setEmail(user.email)
        setIsEditProfile(false)
    }

    async function saveNewProfile() {
        setIsEditProfile(false)

        await updateUserName(firstName + ' ' + lastName)
        await updateUserEmail(email)
        window.location.reload()
    }

    const handleFirstNameChange = (e: any) => {
        setFirstName(e.target.value)
    }

    const handleLastNameChange = (e: any) => {
        setLastName(e.target.value)
    }

    const handleEmailChange = (e: any) => {
        setEmail(e.target.value)
    }

    function handleCancel(e: any): void {
        setIsEditPassword(false)
    }

    const handleOk = async (): Promise<void> => {
        const values = await form.validateFields()
        const newPassword: string = values.password
        const currPassword: string = values.currPassword

        const us = await getAuth().currentUser
        if (us) {
            console.log(currPassword)
            const credential = EmailAuthProvider.credential(
                user.email,
                currPassword
            )
            const reauthenticationResult = await reauthenticateWithCredential(
                us,
                credential
            )

            // If reauthentication succeeds, update the password
            if (reauthenticationResult.user) {
                await updateUserPassword(
                    reauthenticationResult.user,
                    newPassword
                )
                setIsEditPassword(false)
            }
        }
    }

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

    return (
        <div id="profile-settings-body">
            <ToolBar loading={isLoading ? true : false} />
            <div id="profile-settings-content">
                <NavBar />
                <div id="profile-settings-main">
                    <ActionBar title="Profile Settings" />
                    <div id="profile-settings-main-content">
                        <div id="profile-actions">
                            <div id="profile-actions-info">
                                {isLoading ? (
                                    <Skeleton active />
                                ) : (
                                    <>
                                        <div id="pars">
                                            <p>First Name&nbsp;</p>
                                            <p>Last Name&nbsp;</p>
                                            <p>Email&nbsp;</p>
                                        </div>
                                        <div id="spans">
                                            {isEditProfile ? (
                                                <>
                                                    <Input
                                                        className="edit-profile-input"
                                                        onChange={(e) => {
                                                            handleFirstNameChange(
                                                                e
                                                            )
                                                        }}
                                                        value={firstName}
                                                    />
                                                    <Input
                                                        className="edit-profile-input"
                                                        onChange={(e) => {
                                                            handleLastNameChange(
                                                                e
                                                            )
                                                        }}
                                                        value={lastName}
                                                    />
                                                    <Input
                                                        className="edit-profile-input"
                                                        onChange={(e) => {
                                                            handleEmailChange(e)
                                                        }}
                                                        value={email}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <span>{firstName}</span>
                                                    <span>{lastName}</span>
                                                    <span>{email}</span>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div id="profile-actions-buttons">
                                {isLoading ? (
                                    <Skeleton active />
                                ) : (
                                    <>
                                        {!isEditProfile && (
                                            <Button onClick={editProfile}>
                                                Edit Profile
                                            </Button>
                                        )}
                                        <Button
                                            onClick={(e) => {
                                                isEditProfile
                                                    ? saveNewProfile()
                                                    : changePassword(e)
                                            }}
                                        >
                                            {isEditProfile
                                                ? 'Save'
                                                : 'Change Password'}
                                        </Button>
                                        <Button
                                            onClick={(e) => {
                                                isEditProfile
                                                    ? cancelEditProfile()
                                                    : deleteAccount(e)
                                            }}
                                            danger
                                        >
                                            {isEditProfile
                                                ? 'Cancel'
                                                : 'Delete Account'}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <Modal
                title="Change password"
                open={isEditPassword}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={'Confirm'}
                cancelButtonProps={{ danger: true }}
                className="modal-item-input"
                destroyOnClose
            >
                <Form
                    {...formItemLayout}
                    form={form}
                    name="change-password"
                    scrollToFirstError
                >
                    <Form.Item
                        name="currPassword"
                        label="Current Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your current password.',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="New Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your password!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        label="Confirm New Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue('password') === value
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
                </Form>
            </Modal>

            <Modal
                title=""
                open={isDeleteModal}
                onOk={() => {
                    if (validation === 'Delete account') {
                        deleteUserFromFirebase()
                        setIsDeleteModal(false)
                        setValidationStatus(true)
                        setValidation('')
                    } else {
                        setValidationStatus(false)
                    }
                }}
                onCancel={() => {
                    setIsDeleteModal(false)
                    setValidation('')
                    setValidationStatus(true)
                }}
                okText={'Delete Account'}
                okButtonProps={{ danger: true }}
                className="modal-item-input"
                destroyOnClose
            >
                <h3 id="validation-msg">
                    Please type 'Delete account' below for confirmation.
                </h3>
                <Input
                    style={
                        !validationStatus
                            ? { width: '200px', borderColor: 'red' }
                            : { width: '200px' }
                    }
                    onChange={(e) => {
                        handleValidation(e)
                        setValidationStatus(true)
                    }}
                    value={validation}
                />
                <p style={{ fontWeight: 500 }}>This action cannot be undone.</p>
            </Modal>
        </div>
    )
}

export default ProfileSettings
