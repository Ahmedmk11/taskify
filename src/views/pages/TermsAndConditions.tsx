import React, { useEffect } from 'react'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import Footer from '../components/Footer'
import { Button, Space } from 'antd'
import { useNavigate } from 'react-router-dom'

function TermsAndConditions() {
    const navigate = useNavigate()

    return (
        <div id="terms-body">
            <ToolBar />
            <div id="terms-content">
                <div id="terms-main">
                    <div id="terms-main-content">
                        <h2>Terms and Conditions</h2>

                        <p>
                            1. You agree to use Taskify for educational purposes
                            only and not for any commercial or business
                            activities.
                        </p>

                        <p>
                            2. You understand that Taskify is provided as-is and
                            I am not responsible for any data loss or damages
                            resulting from its use.
                        </p>

                        <p>
                            3. You acknowledge that Taskify is an educational
                            project and is not intended to replace professional
                            task management tools.
                        </p>

                        <p>
                            4. You agree not to modify, distribute, or sell
                            Taskify or its source code for commercial purposes.
                        </p>

                        <p>
                            5. You agree to use Taskify responsibly and not to
                            engage in any malicious activities using the
                            application.
                        </p>

                        <p>
                            6. You acknowledge that I, as the creator of
                            Taskify, am not liable for any issues or problems
                            that may arise from its use.
                        </p>

                        <p>
                            7. You understand that Taskify may have bugs or
                            errors as it is an educational project and not a
                            production-ready application.
                        </p>

                        <p>
                            8. You agree to respect the open-source nature of
                            Taskify and adhere to the terms of the associated
                            license.
                        </p>

                        <p>
                            9. You acknowledge that these terms and conditions
                            are subject to change and it is your responsibility
                            to stay updated.
                        </p>

                        <p>
                            By using Taskify, you indicate your acceptance of
                            these terms and conditions. If you do not agree with
                            these terms, please do not use Taskify.
                        </p>

                        <Space wrap>
                            <Button
                                type="primary"
                                onClick={() => {
                                    navigate('/home')
                                }}
                            >
                                Return to Home
                            </Button>
                        </Space>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default TermsAndConditions
