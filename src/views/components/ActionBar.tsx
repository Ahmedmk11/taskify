// --------------------------------------------------------------
// Action Bar react component.
// --------------------------------------------------------------

import React from 'react'
import { Button, Space, Input } from 'antd'
const { Search } = Input
// import PropTypes from 'prop-types'

import filterIcn from '../../assets/icons/filter.svg'
import sortIcn from '../../assets/icons/sort.svg'

// type ActionBarProps = {
//     currentPage: string;
// }

function ActionBar() {
    //props: ActionBarProps) {
    // const { currentPage } = props

    return (
        <>
            <div id="action-bar">
                <h2>Tasks</h2>
                <div id="action-bar-buttons">
                    <Space wrap>
                        <Button className="new-button" type="primary">
                            New Task
                        </Button>
                    </Space>
                    <Space direction="vertical">
                        <Search
                            placeholder="input search text"
                            onSearch={() => console.log('')}
                            style={{ width: 363 }}
                        />
                    </Space>
                    <Button className="custom-button-size">
                        <img src={filterIcn} alt="Icon for filter" />
                    </Button>
                </div>
            </div>
            <hr id="action-bar-hr"></hr>
        </>
    )
}

// ActionBar.propTypes = {
//     currentPage: PropTypes.string,
// }

// ActionBar.defaultProps = {
//     currentPage: 'home',
// }

export default ActionBar
