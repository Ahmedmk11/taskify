// --------------------------------------------------------------
// Tool Bar react component.
// --------------------------------------------------------------

import React from 'react'
import {
    GithubOutlined,
    InstagramFilled,
    LinkedinFilled,
    WhatsAppOutlined,
} from '@ant-design/icons'

function Footer() {
    return (
        <div id="footer-container">
            <div id="copyright">
                <p>
                    Copyright © 2023
                    <span>
                        {new Date().getFullYear() === 2023
                            ? ''
                            : '-' + new Date().getFullYear()}
                    </span>{' '}
                    Taskify. All rights reserved.
                </p>
            </div>
            <div id="socials">
                <GithubOutlined
                    style={{ fontSize: '20px' }}
                    onClick={() => {
                        window.open('https://github.com/Ahmedmk11/')
                    }}
                />
                <LinkedinFilled
                    style={{ fontSize: '20px' }}
                    onClick={() => {
                        window.open(
                            'https://www.linkedin.com/in/ahmed-mahmoud-350b21214/'
                        )
                    }}
                />
                <InstagramFilled
                    style={{ fontSize: '20px' }}
                    onClick={() => {
                        window.open(
                            'https://www.instagram.com/ahmedmahmoud.11/'
                        )
                    }}
                />
                <WhatsAppOutlined
                    style={{ fontSize: '20px' }}
                    onClick={() => {
                        window.open('https://wa.me/+201550800848')
                    }}
                />
            </div>
        </div>
    )
}

export default Footer
