// --------------------------------------------------------------
// ProfileSettings page frontend code.
// --------------------------------------------------------------

import React from 'react'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import Footer from '../components/Footer'

function ProfileSettings() {
    return (
        <div id="profile-settings-body">
            <ToolBar />
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
