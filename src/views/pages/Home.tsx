// --------------------------------------------------------------
// Home page frontend code.
// --------------------------------------------------------------

import React from 'react'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'

function Home() {
    return (
        <>
            <NavBar currentPage='home' />
            <ToolBar />
        </>
    )
}

export default Home
