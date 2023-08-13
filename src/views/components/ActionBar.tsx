// --------------------------------------------------------------
// Action Bar react component.
// --------------------------------------------------------------

import React from 'react'
import { Button, Space, Input } from 'antd'
const { Search } = Input
// import PropTypes from 'prop-types'

import searchIcn from '../../assets/icons/search.svg'
import filterIcn from '../../assets/icons/filter.svg'
import sortIcn from '../../assets/icons/sort.svg'

// type ActionBarProps = {
//     currentPage: string;
// }

function ActionBar() {
    //props: ActionBarProps) {
    // const { currentPage } = props

    return (
        <div id="action-bar">
            <h2>Tasks</h2>
            <div id="action-bar-buttons">
                <Space wrap>
                    <Button type="primary">New Task</Button>
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
                <Button className="custom-button-size">
                    <img src={sortIcn} alt="Icon for sort" />
                </Button>
            </div>
        </div>
    )
}

// ActionBar.propTypes = {
//     currentPage: PropTypes.string,
// }

// ActionBar.defaultProps = {
//     currentPage: 'home',
// }

export default ActionBar
