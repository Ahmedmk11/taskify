import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './views/pages/Home'
import Login from './views/pages/Login'
import Register from './views/pages/Register'
import Placeholder from './views/pages/Placeholder'
import NotFound from './views/pages/NotFound'
import Search from './views/pages/Search'
import ProfileSettings from './views/pages/ProfileSettings'
import TermsAndConditions from './views/pages/TermsAndConditions'
import Task from './views/pages/Task'
import PrivateRoute from './PrivateRoute'
import ForgotPassword from './views/pages/ForgotPassword'

const RouteSwitch = () => {
    return (
        <Routes>
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ForgotPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfileSettings /></PrivateRoute>} />
            {/* <Route path="/placeholder" element={<PrivateRoute><Placeholder user={user} /></PrivateRoute>} /> */}
            <Route path="/task/:id" element={<PrivateRoute><Task /></PrivateRoute>} />
            <Route path="/terms-and-conditions" element={<PrivateRoute><TermsAndConditions /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
        </Routes>

    )
}

export default RouteSwitch
