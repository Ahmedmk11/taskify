// --------------------------------------------------------------
// ProfileSettings page frontend code.
// --------------------------------------------------------------

import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import Footer from '../components/Footer'
import { User } from '../../app/User'
import { getAuth } from 'firebase/auth'
import { readUserDataFromDb } from '../../firebase'

function ProfileSettings() {
    const [user, setUser] = useState(null as unknown as User)
    const [isLoading, setIsLoading] = useState(true)
    const currentUser = getAuth().currentUser

    async function fetchUserData() {
        const userData = await readUserDataFromDb('users', currentUser!.uid)
        setUser(userData!)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchUserData()
    }, [])

    if (isLoading) {
        return <div>Loading...</div>
    }
    return (
        <div id="profile-settings-body">
            <ToolBar user={user} />
            <div id="profile-settings-content">
                <NavBar />
                <div id="profile-settings-main">
                    <div id="profile-settings-main-content"></div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ProfileSettings
