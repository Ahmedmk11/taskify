import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import RouteSwitch from './routeSwitch'

const root = document.getElementById('root')!
ReactDOM.render(
    <BrowserRouter>
        <RouteSwitch />
    </BrowserRouter>,
    root
)
