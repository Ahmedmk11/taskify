// --------------------------------------------------------------
// Placeholder page frontend code.
// --------------------------------------------------------------

import React from 'react'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import ActionBar from '../components/ActionBar'

function Placeholder() {
    return (
        <div id="home-body">
            <ToolBar />
            <div id="home-content">
                <NavBar currentPage={'placeholder'} />
                <div id="home-main">
                    <ActionBar />
                    <div id="home-main-content"></div>
                </div>
            </div>
        </div>
    )
}

export default Placeholder
