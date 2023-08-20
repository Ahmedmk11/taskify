// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
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

const RouteSwitch = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/placeholder" element={<Placeholder />} />
            <Route path="/task/:id" element={<Task />} />
            <Route
                path="/terms-and-conditions"
                element={<TermsAndConditions />}
            />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default RouteSwitch
