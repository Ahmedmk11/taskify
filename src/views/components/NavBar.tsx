// --------------------------------------------------------------
// Navigation Bar react component.
// --------------------------------------------------------------

import React from 'react'
import homeIcn from '../../assets/icons/home.svg'
import placeHolderIcn from '../../assets/icons/placeholder.svg'
import logoutIcn from '../../assets/icons/logout.svg'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

type NavBarProps = {
    currentPage: string;
}

function NavBar(props: NavBarProps) {
    const { currentPage } = props

    const navigate = useNavigate()
    const classSelect = (page: string): string => {
        return (currentPage === page) ? 'nav-item selected-nav-item' : 'nav-item'
    }

    return (
        <div id='nav-bar'>
            <div id="nav-bar-top">
                <div id="nav-bar-header">
                    <h1 onClick={() => {
                        navigate('/home')
                    }}>taskify</h1>
                </div>
                <div id="nav-bar-body">
                    <div className={classSelect('home')} onClick={() => {
                            navigate('/home')
                        }}>
                        <img src={homeIcn} alt="Icon for home page" />
                        <p>Home</p>
                    </div>
                    <div className={classSelect('placeholder')} onClick={() => {
                            navigate('/placeholder')
                        }}>
                        <img src={placeHolderIcn} alt="Icon for placeholder page" />
                        <p>Placeholder</p>
                    </div>
                </div>
            </div>
            <div id="nav-bar-bottom">
                <div className="nav-item" onClick={() => {
                        navigate('/login')
                    }}>
                    <img src={logoutIcn} alt="Icon for logout" />
                    <p>Log Out</p>
                </div>
            </div>
        </div>
    )
}

NavBar.propTypes = {
    currentPage: PropTypes.string,
}

NavBar.defaultProps = {
    currentPage: 'home',
}

export default NavBar
