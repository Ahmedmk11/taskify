// --------------------------------------------------------------
// Placeholder page frontend code.
// --------------------------------------------------------------

import React from 'react'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import ActionBar from '../components/ActionBar'

function Placeholder() {
    return (
        <div id="placeholder-body">
            <ToolBar />
            <div id="placeholder-content">
                <NavBar currentPage={'placeholder'} />
                <div id="placeholder-main">
                    <ActionBar />
                    <div id="placeholder-main-content"></div>
                </div>
            </div>
        </div>
    )
}

export default Placeholder
