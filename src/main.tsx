import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import RouteSwitch from './routeSwitch'
import { EditCardProvider } from './views/components/EditCardProvider'

const root = document.getElementById('root')!
ReactDOM.render(
    <BrowserRouter>
        <EditCardProvider>
            <RouteSwitch />
        </EditCardProvider>
    </BrowserRouter>,
    root
)
