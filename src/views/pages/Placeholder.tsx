// --------------------------------------------------------------
// Placeholder page frontend code.
// --------------------------------------------------------------

import React from 'react'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import ActionBar from '../components/ActionBar'
import Footer from '../components/Footer'
import { User } from '../../app/User'

type PlaceholderProps = {
    user: User | null
}

function Placeholder(props: PlaceholderProps) {
    const { user } = props
    return (
        <div id="placeholder-body">
            <ToolBar user={user} />
            <div id="placeholder-content">
                <NavBar currentPage={'placeholder'} />
                <div id="placeholder-main">
                    <ActionBar />
                    <div id="placeholder-main-content"></div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Placeholder
