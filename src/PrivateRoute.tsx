import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

function PrivateRoute({ children }: any) {
    const navigate = useNavigate()
    const auth = getAuth()
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/login')
            }
        })
    }, [auth, navigate])

    return children
}

export default PrivateRoute
