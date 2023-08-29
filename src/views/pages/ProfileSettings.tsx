// --------------------------------------------------------------
// ProfileSettings page frontend code.
// --------------------------------------------------------------

import React, { useEffect, useRef, useState } from 'react'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import Footer from '../components/Footer'
import { User } from '../../app/User'
import {
    EmailAuthProvider,
    UserCredential,
    getAuth,
    onAuthStateChanged,
    reauthenticateWithCredential,
} from 'firebase/auth'
import {
    addNewCategoryToCurrentUser,
    deleteCategoryFromUser,
    deleteUserFromFirebase,
    readUserDataFromDb,
    updateUserEmail,
    updateUserName,
    updateUserPassword,
} from '../../firebase'
import {
    Button,
    Form,
    Input,
    List,
    Modal,
    Skeleton,
    Typography,
    message,
} from 'antd'
import ActionBar from '../components/ActionBar'
import labelIcn from '../../assets/icons/label.svg'
import { CloseOutlined } from '@ant-design/icons'
import { doc, getFirestore, onSnapshot } from 'firebase/firestore'

function ProfileSettings() {
    const [form] = Form.useForm()
    const [user, setUser] = useState(null as unknown as User)
    const [isLoading, setIsLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [isEditProfile, setIsEditProfile] = useState(false)
    const [allCats, setAllCats] = useState(user ? user.categories : [])
    const [categoryValue, setCategoryValue] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [categoryStatus, setCategoryStatus] = useState(false)
    const [isEditPassword, setIsEditPassword] = useState(false)
    const [isDeleteModal, setIsDeleteModal] = useState(false)
    const [validation, setValidation] = useState('')
    const [validationStatus, setValidationStatus] = useState(true)
    const [alreadyExistsMsg, setAlreadyExistsMsg] = useState(false)

    const inputRef = useRef<any>(null)

    const LabelIcon = () => (
        <img style={{ width: 24, height: 24 }} src={labelIcn} />
    )

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
            setAllCats(user.categories)
        }
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

    useEffect(() => {
        const newCatInput = document.getElementById('new-cat-input')
        if (isAdding) {
            newCatInput?.setAttribute('style', 'display: flex; opacity: 0;')
            setTimeout(() => {
                newCatInput?.classList.add('show-input')
            }, 150)
        } else {
            newCatInput?.classList.remove('show-input')
            setTimeout(() => {
                newCatInput?.setAttribute('style', 'display: none;')
            }, 200)
        }
    }, [isAdding])

    const CustomMessage = ({ msg }: { msg: string }) => (
        <div className="feedback-msg">{msg}</div>
    )

    const showMessage = (msg: string) => {
        message.open({
            content: <CustomMessage msg={msg} />,
            duration: 1.5,
        })
    }

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

    function saveCategory(value: string) {
        if (categoryValue.trim().length >= 2) {
            if (!allCats.includes(categoryValue)) {
                console.log('Category saved:', categoryValue.trim())
                setIsAdding(false)
                setCategoryStatus(false)
                setAllCats([...allCats, value])
                addNewCategoryToCurrentUser(value)
                showMessage(`New category added: ${categoryValue}`)
                setCategoryValue('')
                setAlreadyExistsMsg(false)
            } else {
                setCategoryStatus(true)
                setAlreadyExistsMsg(true)
            }
        } else {
            setCategoryStatus(true)
            setAlreadyExistsMsg(false)
        }
    }
    function deleteCategory(ev: any) {
        const catElement = ev.target.closest('[id^="category-"]')
        if (catElement) {
            const cat = catElement.id.split('category-')[1]
            if (cat) {
                deleteCategoryFromUser(cat)
                const updatedCats = allCats.filter(
                    (category) => category !== cat
                )
                setAllCats(updatedCats)
                showMessage(`Category deleted: ${cat}`)
            }
        }
    }

    function cancelCategory() {
        setIsAdding(false)
        setCategoryValue('')
        setCategoryStatus(false)
        setAlreadyExistsMsg(false)
    }

    function cancelEditProfile() {
        setIsEditProfile(false)
        setLastName(user.name.split(' ')[0])
        setLastName(user.name.split(' ')[1])
        setEmail(user.email)
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
                        <div id="user-categories">
                            <h2>
                                {isLoading ? (
                                    <Skeleton.Input active block />
                                ) : (
                                    'My Categories'
                                )}
                            </h2>
                            <List
                                id="all-categories"
                                bordered
                                style={{ width: '85%' }}
                                dataSource={
                                    isLoading
                                        ? ['x', 'x', 'x', 'x', 'x', 'x']
                                        : allCats
                                }
                                renderItem={(item) =>
                                    isLoading ? (
                                        <Skeleton.Input
                                            style={{ width: '85%' }}
                                            active
                                            block
                                        />
                                    ) : (
                                        <List.Item id={`category-${item}`}>
                                            <Typography.Text
                                                mark
                                            ></Typography.Text>
                                            <div className="list-item">
                                                {item}
                                                <CloseOutlined
                                                    onClick={(ev: any) => {
                                                        deleteCategory(ev)
                                                    }}
                                                />
                                            </div>
                                        </List.Item>
                                    )
                                }
                            />
                            {!isLoading && (
                                <Button
                                    onClick={() => {
                                        setIsAdding(true)
                                    }}
                                >
                                    Add new category
                                </Button>
                            )}
                            <div id="new-cat-input">
                                <Input
                                    allowClear
                                    style={{ width: '400px' }}
                                    size="large"
                                    placeholder="Add a new category"
                                    prefix={<LabelIcon />}
                                    value={categoryValue}
                                    onChange={(ev) =>
                                        setCategoryValue(ev.target.value)
                                    }
                                    onKeyDown={(ev: any) => {
                                        if (ev.key === 'Enter') {
                                            saveCategory(ev.target.value)
                                        }
                                    }}
                                    status={categoryStatus ? 'error' : ''}
                                    ref={inputRef}
                                />
                                {alreadyExistsMsg && (
                                    <p
                                        style={{
                                            margin: 5,
                                            fontSize: 12,
                                            color: 'red',
                                        }}
                                    >
                                        This category already exists.
                                    </p>
                                )}
                                <div id="new-cat-buttons">
                                    <Button
                                        danger
                                        onClick={() => {
                                            cancelCategory()
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="primary"
                                        onClick={(ev: any) => {
                                            saveCategory(categoryValue)
                                        }}
                                    >
                                        Save
                                    </Button>
                                </div>
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
