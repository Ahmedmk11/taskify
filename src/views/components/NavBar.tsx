import React, { useState } from 'react'
import homeIcn from '../../assets/icons/home.svg'
import placeHolderIcn from '../../assets/icons/placeholder.svg'
import logoutIcn from '../../assets/icons/logout.svg'
import hideShowIcn from '../../assets/icons/hide-show.svg'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

type NavBarProps = {
    currentPage: string
    status: string
}

function NavBar(props: NavBarProps) {
    const { currentPage, status } = props
    const navigate = useNavigate()
    const [isHomeSubVisible, setHomeSubVisible] = useState(false)

    const classSelect = (page: string): string => {
        if (currentPage === 'home') {
            if (status === page) {
                return 'nav-item selected-nav-item'
            }
        } else if (currentPage === page) {
            return 'nav-item selected-nav-item'
        }
        return 'nav-item'
    }

    const expand = () => {
        setHomeSubVisible(!isHomeSubVisible)
    }

    return (
        <div id="nav-bar">
            <div id="nav-bar-top">
                <div id="nav-bar-header">
                    <h1
                        onClick={() => {
                            navigate('/home')
                        }}
                    >
                        taskify
                    </h1>
                </div>
                <div id="nav-bar-body">
                    <div className="nav-item" onClick={expand}>
                        <img src={homeIcn} alt="Icon for home page" />
                        <p>Home</p>
                        <img
                            id="hide-show"
                            src={hideShowIcn}
                            alt="Icon for hiding/showing categories"
                            className={isHomeSubVisible ? 'rotate' : ''}
                        />
                    </div>
                    <div
                        id="home-sub"
                        className={!isHomeSubVisible ? 'show-class' : ''}
                    >
                        <div className={classSelect('inprogress')} id="p-item">
                            <p
                                onClick={() => {
                                    navigate('/inprogress')
                                }}
                            >
                                In Progress
                            </p>
                        </div>
                        <div className={classSelect('todo')} id="p-item">
                            <p
                                onClick={() => {
                                    navigate('/todo')
                                }}
                            >
                                To Do
                            </p>
                        </div>
                        <div className={classSelect('completed')} id="p-item">
                            <p
                                onClick={() => {
                                    navigate('/completed')
                                }}
                            >
                                Completed
                            </p>
                        </div>
                        <div className={classSelect('pending')} id="p-item">
                            <p
                                onClick={() => {
                                    navigate('/pending')
                                }}
                            >
                                Pending
                            </p>
                        </div>
                    </div>
                    <div
                        className={classSelect('placeholder')}
                        onClick={() => {
                            navigate('/placeholder')
                        }}
                    >
                        <img
                            src={placeHolderIcn}
                            alt="Icon for placeholder page"
                        />
                        <p>Placeholder</p>
                    </div>
                </div>
            </div>
            <div id="nav-bar-bottom">
                <div
                    className="nav-item"
                    onClick={() => {
                        navigate('/login')
                    }}
                >
                    <img src={logoutIcn} alt="Icon for logout" />
                    <p>Log Out</p>
                </div>
            </div>
        </div>
    )
}

NavBar.propTypes = {
    currentPage: PropTypes.string,
    status: PropTypes.string,
}

NavBar.defaultProps = {
    currentPage: 'home',
    status: 'inprogress',
}

export default NavBar
