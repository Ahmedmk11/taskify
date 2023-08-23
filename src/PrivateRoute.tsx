import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Login from './views/pages/Login';

function PrivateRoute({ children }: any) {
    const navigate = useNavigate();
    const auth = getAuth()
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            const auth = getAuth()
            if (!user) {
                navigate('/login');
            } else {
                navigate('/home');
            }
        })
    }, [auth, navigate]);

    return children
}

export default PrivateRoute
