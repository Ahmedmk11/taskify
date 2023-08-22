import React, { useEffect, useState } from 'react'
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
import { readUserDataFromDb } from './firebase'
import { getAuth } from 'firebase/auth'
import { User } from './app/User'
import PrivateRoute from './PrivateRoute'

const RouteSwitch = () => {
    const auth = getAuth()
    const currUser = auth.currentUser!
    const [user, setUser] = useState<User | null>(null)
    // useEffect(() => {
    //     readUserDataFromDb('users', currUser?.uid)?.then((userData) => {
    //         setUser(userData)
    //     })
    // }, [])

    
    return (
        <Routes>
            <Route path="/" element={<PrivateRoute><Home user={user} /></PrivateRoute>} />
            <Route path="/home" element={<PrivateRoute><Home user={user} /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<PrivateRoute><Search user={user} /></PrivateRoute>} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<PrivateRoute><ProfileSettings user={user} /></PrivateRoute>} />
            <Route path="/placeholder" element={<PrivateRoute><Placeholder user={user} /></PrivateRoute>} />
            <Route path="/task/:id" element={<PrivateRoute><Task user={user} /></PrivateRoute>} />
            <Route path="/terms-and-conditions" element={<PrivateRoute><TermsAndConditions user={user} /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
        </Routes>

    )
}

export default RouteSwitch
