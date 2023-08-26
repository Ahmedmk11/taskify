// --------------------------------------------------------------
// ProfileSettings page frontend code.
// --------------------------------------------------------------

import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import Footer from '../components/Footer'
import { User } from '../../app/User'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { readUserDataFromDb } from '../../firebase'
import { Button, Input, List, Skeleton, Typography } from 'antd'
import ActionBar from '../components/ActionBar'
import labelIcn from '../../assets/icons/label.svg'
import { CloseOutlined } from '@ant-design/icons'

function ProfileSettings() {
    const [user, setUser] = useState(null as unknown as User)
    const [isLoading, setIsLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [categoryValue, setCategoryValue] = useState('')
    const [categoryStatus, setCategoryStatus] = useState(false)

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
        const hideFiltersContainer = () => {
            const filtersContainer =
                document.getElementById('filters-container')
            if (filtersContainer) {
                filtersContainer.classList.add('visibility-hidden')
            }
        }
        hideFiltersContainer()
    }, [user])

    function editProfile(ev: any) {
        throw new Error('Function not implemented.')
    }

    function deleteAccount(ev: any) {
        throw new Error('Function not implemented.')
    }

    function changePassword(ev: any) {
        throw new Error('Function not implemented.')
    }

    function saveCategory() {
        if (categoryValue.trim().length >= 2) {
            console.log('Category saved:', categoryValue.trim())
            setIsAdding(false)
            setCategoryStatus(false)
            // add to db
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
                                        ? [
                                              'x',
                                              'x',
                                              'x',
                                              'x',
                                              'x',
                                              'x',
                                              'x',
                                              'x',
                                              'x',
                                              'x',
                                          ]
                                        : user.categories
                                } // Use user.categories as dataSource
                                renderItem={(item) =>
                                    isLoading ? (
                                        <Skeleton.Input
                                            style={{ marginTop: '12px' }}
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
                            {isAdding && (
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
                                                saveCategory()
                                            }
                                        }}
                                        status={categoryStatus ? 'error' : ''}
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
                                            onClick={() => {
                                                saveCategory()
                                            }}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ProfileSettings
