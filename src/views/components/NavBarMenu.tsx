import React, { useEffect, useRef, useState } from 'react'
import homeIcn from '../../assets/icons/home.svg'
import calendarIcn from '../../assets/icons/calendar.svg'
import categoryIcn from '../../assets/icons/category.svg'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { CloseOutlined } from '@ant-design/icons'

type NavBarMenuProps = {
    currentPage: string
}

function NavBarMenu(props: NavBarMenuProps) {
    const { currentPage } = props
    const [ page, setPage ] = useState(currentPage)
    const navigate = useNavigate()

    const classSelect = (cpage: string): string => {
        if (page === cpage) {
            return 'nav-item selected-nav-item'
        }
        return 'nav-item'
    }

    useEffect(() => {
        if (currentPage === 'None') {
            let p = window.location.href.split('/').pop()
            switch (p) {
                case 'home':
                    setPage('home')
                    break;
                case '':
                    setPage('home')
                    break;
                case 'my-categories':
                    setPage('categories')
                    break
                case 'calendar':
                    setPage('calendar')
                    break;
                default:
                    break
            }
        }
    })

    return (
        <div id="nav-bar-menu">
            <CloseOutlined id='close-nav-menu' />
            <div id="nav-bar-menu-top">
                <div
                    className={classSelect('home')}
                    onClick={() => {
                        navigate('/home')
                    }}
                >
                    <img src={homeIcn} alt="Icon for home page" />
                    <p>Home</p>
                </div>
                <div
                    className={classSelect('calendar')}
                    onClick={() => {
                        navigate('/calendar')
                    }}
                >
                    <img src={calendarIcn} alt="Icon for calendar page" />
                    <p>Calendar</p>
                </div>
                <div
                    className={classSelect('categories')}
                    onClick={() => {
                        navigate('/my-categories')
                    }}
                >
                    <img src={categoryIcn} alt="Icon for categories page" />
                    <p>Categories</p>
                </div>
            </div>
        </div>
    )
}

NavBarMenu.propTypes = {
    currentPage: PropTypes.string,
}

NavBarMenu.defaultProps = {
    currentPage: 'None',
}

export default NavBarMenu
