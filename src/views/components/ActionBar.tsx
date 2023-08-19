// --------------------------------------------------------------
// Action Bar react component.
// --------------------------------------------------------------

import React from 'react'
import { Button, Space, Input } from 'antd'
const { Search } = Input
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import filterIcn from '../../assets/icons/filter.svg'

type ActionBarProps = {
    handleCreate: () => void
    handleFilters: () => void
    title: string
    isSrch: boolean
    isDisabled: boolean
}

function ActionBar(props: ActionBarProps) {
    const { handleCreate, handleFilters, title, isSrch, isDisabled } = props
    const navigate = useNavigate()

    return (
        <>
            <div id="action-bar">
                <h2>{title}</h2>
                <div id="action-bar-buttons">
                    <Space
                        wrap
                        style={
                            isSrch
                                ? { visibility: 'hidden' }
                                : { display: 'block' }
                        }
                    >
                        <Button
                            onClick={() => {
                                handleCreate()
                            }}
                            className="new-button"
                            type="primary"
                        >
                            New Task
                        </Button>
                    </Space>
                    <Space direction="vertical">
                        <Search
                            placeholder="input search text"
                            onSearch={(value) =>
                                navigate(`/search?query=${value}`)
                            }
                            style={{ width: 363 }}
                        />
                    </Space>
                    <Button
                        disabled={isDisabled}
                        className="custom-button-size"
                        onClick={() => {
                            handleFilters()
                        }}
                    >
                        <img src={filterIcn} alt="Icon for filter" />
                    </Button>
                </div>
            </div>
            <hr id="action-bar-hr"></hr>
        </>
    )
}

ActionBar.propTypes = {
    handleCreate: PropTypes.func,
    handleFilters: PropTypes.func,
    title: PropTypes.string.isRequired,
    isSrch: PropTypes.bool,
    isDisabled: PropTypes.bool,
}

ActionBar.defaultProps = {
    handleCreate: () => {
        console.log('create')
    },
    handleFilters: () => {
        console.log('filters')
    },
    title: 'Tasks',
    isSrch: false,
    isDisabled: false,
}

export default ActionBar
