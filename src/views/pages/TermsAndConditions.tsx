// --------------------------------------------------------------
// Placeholder page frontend code.
// --------------------------------------------------------------

import React from 'react'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import Footer from '../components/Footer'
import { User } from '../../app/User'

function TermsAndConditions() {
    return (
        <div id="terms-body">
            <ToolBar />
            <div id="terms-content">
                <NavBar currentPage={'placeholder'} />
                <div id="terms-main">
                    <div id="terms-main-content"></div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default TermsAndConditions
