// --------------------------------------------------------------
// Not Found page frontend code.
// --------------------------------------------------------------

import React from 'react'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import Footer from '../components/Footer'
import { Button, Space } from 'antd'
import { useNavigate } from 'react-router-dom'

function NotFound() {
    const navigate = useNavigate()
    return (
        <div id="not-found-body">
            <ToolBar />
            <div id="not-found-content">
                <NavBar />
                <div id="not-found-main">
                    <div id="not-found-main-content">
                        <h2>Page not found..</h2>
                        <p>We're unable to find the page you're looking for.</p>
                        <Space wrap>
                            <Button
                                type="primary"
                                onClick={() => {
                                    navigate('/home')
                                }}
                            >
                                Return to home
                            </Button>
                        </Space>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default NotFound
