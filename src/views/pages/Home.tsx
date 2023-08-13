// --------------------------------------------------------------
// Home page frontend code.
// --------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import ActionBar from '../components/ActionBar'
import Card from '../components/Card'

type HomeProps = {
    status: string
}

function Home(props: HomeProps) {
    const { status } = props
    return (
        <>
            <NavBar currentPage="home" status={status} />
            <div id="right-container">
                <ToolBar />
                <ActionBar />
                <div id="home-body">
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                </div>
            </div>
        </>
    )
}

Home.propTypes = {
    state: PropTypes.string,
}

Home.defaultProps = {
    state: 'inprogress',
}

export default Home
