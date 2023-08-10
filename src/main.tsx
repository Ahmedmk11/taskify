import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './views/pages/Home'
import { BrowserRouter } from 'react-router-dom'
import RouteSwitch from './RouteSwitch'

const root = document.getElementById('root')!
ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <BrowserRouter>
            <RouteSwitch />
        </BrowserRouter>
    </React.StrictMode>
)
