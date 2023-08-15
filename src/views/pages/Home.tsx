// --------------------------------------------------------------
// Home page frontend code.
// --------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import ActionBar from '../components/ActionBar'
import plusIcn from '../../assets/icons/plus.svg'
import Card from '../components/Card'

type HomeProps = {
    currentPage: string
}

function Home(props: HomeProps) {
    const { currentPage } = props
    return (
        <div id="home-body">
            <ToolBar />
            <div id="home-content">
                <NavBar currentPage={currentPage} />
                <div id="home-main">
                    <ActionBar />
                    <div id="home-main-content">
                        <div className="column">
                            <div className="cards-status">
                                <p>To Do</p>
                                <div className="image-container">
                                    <img src={plusIcn} alt="plus icon" />
                                </div>
                            </div>
                            <div className="cards">
                                <Card />
                                <Card />
                                <Card />
                            </div>
                        </div>
                        <div className="column">
                            <div className="cards-status">
                                <p>In Progress</p>
                                <div className="image-container">
                                    <img src={plusIcn} alt="plus icon" />
                                </div>
                            </div>
                            <div className="cards">
                                <Card />
                                <Card />
                            </div>
                        </div>
                        <div className="column">
                            <div className="cards-status">
                                <p>Done</p>
                                <div className="image-container">
                                    <img src={plusIcn} alt="plus icon" />
                                </div>
                            </div>
                            <div className="cards">
                                <Card />
                                <Card />
                                <Card />
                                <Card />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

Home.propTypes = {
    currentPage: PropTypes.string,
}

Home.defaultProps = {
    currentPage: 'inprogress',
}

export default Home
