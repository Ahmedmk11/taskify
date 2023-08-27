// --------------------------------------------------------------
// Action Bar react component.
// --------------------------------------------------------------

import React from 'react'
import { Button, Space, Input, Tooltip, Skeleton } from 'antd'
const { Search } = Input
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import filterIcn from '../../assets/icons/filter.svg'

type ActionBarProps = {
    handleCreate: () => void
    handleFilters: () => void
    title: string
    isHideButton: boolean
    isDisabled: boolean
}

function ActionBar(props: ActionBarProps) {
    const { handleCreate, handleFilters, title, isHideButton, isDisabled } =
        props
    const navigate = useNavigate()

    return (
        <>
            <div id="action-bar">
                {title == 'Task-undefined' ? (
                    <Skeleton.Button
                        style={{ marginLeft: '24px' }}
                        active
                        block
                    />
                ) : (
                    <h2>{title}</h2>
                )}
                {title !== 'Profile Settings' && title !== 'Calendar' && (
                    <div id="action-bar-buttons">
                        <Space
                            wrap
                            style={
                                isHideButton
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
                                placeholder="What are you looking for?"
                                onSearch={(value) => {
                                    navigate(`/search?query=${value}`)
                                }}
                                allowClear
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
                )}
            </div>
            <hr id="action-bar-hr"></hr>
        </>
    )
}

ActionBar.propTypes = {
    handleCreate: PropTypes.func,
    handleFilters: PropTypes.func,
    title: PropTypes.string.isRequired,
    isHideButton: PropTypes.bool,
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
    isHideButton: false,
    isDisabled: false,
}

export default ActionBar
