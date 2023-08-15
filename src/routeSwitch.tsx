// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './views/pages/Home'
import Login from './views/pages/LoginPage'
import Register from './views/pages/RegisterPage'
import Placeholder from './views/pages/Placeholder'
import NotFound from './views/pages/NotFound'

const RouteSwitch = () => {
    const [isHomeSubVisible, setHomeSubVisible] = useState(false)
    return (
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/placeholder" element={<Placeholder />} />
        </Routes>
    )
}

export default RouteSwitch