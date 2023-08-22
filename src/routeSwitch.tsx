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
            <Route path="/" element={user ? <Home user={user} /> : <Login />} />
            <Route path="/home" element={<Home user={user} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<Search user={user} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProfileSettings user={user} />} />
            <Route path="/placeholder" element={<Placeholder user={user} />} />
            <Route path="/task/:id" element={<Task user={user} />} />
            <Route
                path="/terms-and-conditions"
                element={<TermsAndConditions user={user} />}
            />
            <Route path="*" element={<NotFound user={user} />} />
        </Routes>
    )
}

export default RouteSwitch
