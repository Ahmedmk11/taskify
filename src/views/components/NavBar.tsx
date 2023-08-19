import React from 'react'
import homeIcn from '../../assets/icons/home.svg'
import placeHolderIcn from '../../assets/icons/placeholder.svg'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

type NavBarProps = {
    currentPage: string
}

function NavBar(props: NavBarProps) {
    const { currentPage } = props
    const navigate = useNavigate()

    const classSelect = (page: string): string => {
        if (currentPage === page) {
            return 'nav-item selected-nav-item'
        }
        return 'nav-item'
    }

    return (
        <div id="nav-bar">
            <div id="nav-bar-top">
                <div
                    className={classSelect('home')}
                    onClick={() => {
                        navigate('/home')
                    }}
                >
                    <img src={homeIcn} alt="Icon for home page" />
                </div>
                <div
                    className={classSelect('placeholder')}
                    onClick={() => {
                        navigate('/placeholder')
                    }}
                >
                    <img src={placeHolderIcn} alt="Icon for placeholder page" />
                </div>
            </div>
        </div>
    )
}

NavBar.propTypes = {
    currentPage: PropTypes.string,
}

NavBar.defaultProps = {
    currentPage: 'None',
}

export default NavBar
