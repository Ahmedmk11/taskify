// --------------------------------------------------------------
// Tool Bar react component.
// --------------------------------------------------------------

import React from 'react'
// import PropTypes from 'prop-types'

import notificationsIcn from '../../assets/icons/notifications.svg'
import aviIcn from '../../assets/icons/avi.svg'

// type ToolBarProps = {
//     currentPage: string;
// }

function ToolBar() { //props: ToolBarProps) {
    // const { currentPage } = props

    return (
        <div id='tool-bar'>
            <div id="tool-bar-item">
                <img src={notificationsIcn} alt="Icon for notificatons" />
                <div id="tool-bar-profile">
                    <img src={aviIcn} alt="Icon for avi" />
                    <p>Khaled</p>
                </div>
            </div>
        </div>
    )
}

// ToolBar.propTypes = {
//     currentPage: PropTypes.string,
// }

// ToolBar.defaultProps = {
//     currentPage: 'home',
// }

export default ToolBar
