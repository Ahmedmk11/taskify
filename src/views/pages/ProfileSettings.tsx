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
import { Button, Skeleton } from 'antd'
import ActionBar from '../components/ActionBar'

function ProfileSettings() {
    const [user, setUser] = useState(null as unknown as User)
    const [isLoading, setIsLoading] = useState(true)

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

    function editProfile(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        throw new Error('Function not implemented.')
    }

    function deleteAccount(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        throw new Error('Function not implemented.')
    }

    function changePassword(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        throw new Error('Function not implemented.')
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
                        <div id="user-categories"></div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ProfileSettings
