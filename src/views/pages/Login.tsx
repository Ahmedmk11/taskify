// --------------------------------------------------------------
// Login page frontend code.
// --------------------------------------------------------------

import React from 'react'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import Footer from '../components/Footer'

function LoginPage() {
    return (
        <div id="login-body">
            <ToolBar />
            <div id="login-content">
                <NavBar />
                <div id="login-main">
                    <div id="login-main-content"></div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default LoginPage
