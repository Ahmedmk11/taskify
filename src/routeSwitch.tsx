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
            <Route path="/home" element={user ? <Home user={user} /> : <Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={user ? <Search user={user} /> : <Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={user ? <ProfileSettings user={user} /> : <Login />} />
            <Route path="/placeholder" element={user ? <Placeholder user={user} /> : <Login />} />
            <Route path="/task/:id" element={user ? <Task user={user} /> : <Login />} />
            <Route path="/terms-and-conditions" element={user ? <TermsAndConditions user={user} /> : <Login />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default RouteSwitch
