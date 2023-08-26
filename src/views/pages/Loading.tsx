// --------------------------------------------------------------
// Loading react page.
// --------------------------------------------------------------

import React from 'react'
import ToolBar from '../components/ToolBar'
import NavBar from '../components/NavBar'
import { Skeleton } from 'antd'

function Loading() {
    return (
        <div id="loading-body">
            <ToolBar loading />
            <div id="loading-content">
                <NavBar />
                <div id="loading-main">
                    <div id="loading-main-content">
                        <Skeleton active />
                        <Skeleton active />
                        <Skeleton active />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Loading
