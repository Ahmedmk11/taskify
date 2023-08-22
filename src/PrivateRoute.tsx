import { useNavigate } from "react-router-dom";
import React, { useEffect } from 'react';

function PrivateRoute({ children } : any) {
    const navigate = useNavigate();
    const user = null // change this
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) {
        return null
    }
    return children;
}

export default PrivateRoute
