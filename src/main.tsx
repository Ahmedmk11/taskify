import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './views/pages/Home'

const root = document.getElementById('root')!
ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <Home />
    </React.StrictMode>
)
