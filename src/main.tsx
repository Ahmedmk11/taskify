import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import RouteSwitch from './routeSwitch'

const root = document.getElementById('root')!
ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <BrowserRouter>
            <RouteSwitch />
        </BrowserRouter>
    </React.StrictMode>
)
