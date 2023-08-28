// --------------------------------------------------------------
// ProfileSettings page frontend code.
// --------------------------------------------------------------

import React, { useEffect, useRef, useState } from 'react'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import Footer from '../components/Footer'
import { User } from '../../app/User'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { addNewCategoryToCurrentUser, readUserDataFromDb } from '../../firebase'
import { Button, Input, List, Skeleton, Typography, message } from 'antd'
import ActionBar from '../components/ActionBar'
import labelIcn from '../../assets/icons/label.svg'
import { CloseOutlined } from '@ant-design/icons'

function ProfileSettings() {
    const [user, setUser] = useState(null as unknown as User)
    const [isLoading, setIsLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [allCats, setAllCats] = useState(user ? user.categories : [])
    const [categoryValue, setCategoryValue] = useState('')
    const [categoryStatus, setCategoryStatus] = useState(false)
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
    }, [user])

    const CustomMessage = () => (
        <div className="feedback-msg">New Category Added: {categoryValue}</div>
    )

    const showMessage = () => {
        message.open({
            content: <CustomMessage />,
            duration: 1.5,
        })
    }

    function editProfile(ev: any) {
        throw new Error('Function not implemented.')
    }

    function deleteAccount(ev: any) {
        throw new Error('Function not implemented.')
    }

    function changePassword(ev: any) {
        throw new Error('Function not implemented.')
    }

    function saveCategory(value: string) {
        if (categoryValue.trim().length >= 2) {
            console.log('Category saved:', categoryValue.trim())
            setIsAdding(false)
            setCategoryStatus(false)
            setAllCats([...allCats, value])
            addNewCategoryToCurrentUser(value)
            showMessage()
            setCategoryValue('')
        } else {
            setCategoryStatus(true)
        }
    }

    function deleteCategory(ev: any) {
        throw new Error('Function not implemented.')
    }

    function cancelCategory() {
        setIsAdding(false)
        setCategoryValue('')
        setCategoryStatus(false)
        if (inputRef.current) {
            inputRef.current.setValue('') // Clear input value
            inputRef.current.setState({ value: '', dirty: false }) // Reset validation status
        }
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
                                            <span>
                                                {user.name.split(' ')[0]}
                                            </span>
                                            <span>
                                                {user.name.split(' ')[1]}
                                            </span>
                                            <span>{user.email}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div id="profile-actions-buttons">
                                {isLoading ? (
                                    <Skeleton />
                                ) : (
                                    <>
                                        <Button
                                            onClick={(e) => {
                                                editProfile(e)
                                            }}
                                        >
                                            Edit Profile
                                        </Button>
                                        <Button
                                            onClick={(e) => {
                                                changePassword(e)
                                            }}
                                        >
                                            Change Password
                                        </Button>
                                        <Button
                                            onClick={(e) => {
                                                deleteAccount(e)
                                            }}
                                            danger
                                        >
                                            Delete Account
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
                                        <List.Item>
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
        </div>
    )
}

export default ProfileSettings
