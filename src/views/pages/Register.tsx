// --------------------------------------------------------------
// Register page frontend code.
// --------------------------------------------------------------

import React from 'react'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import Footer from '../components/Footer'

function Register() {
    return (
        <div id="register-body">
            <ToolBar />
            <div id="register-content">
                <NavBar />
                <div id="register-main">
                    <div id="register-main-content"></div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Register
