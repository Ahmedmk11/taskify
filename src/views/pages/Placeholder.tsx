// --------------------------------------------------------------
// Placeholder page frontend code.
// --------------------------------------------------------------

import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import ToolBar from '../components/ToolBar'
import ActionBar from '../components/ActionBar'
import Footer from '../components/Footer'
import { User } from '../../app/User'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { readUserDataFromDb } from '../../firebase'

function Placeholder() {
    const [user, setUser] = useState(null as unknown as User)
    const [isLoading, setIsLoading] = useState(true)
    const tasks = user ? user.taskArray : []

    async function fetchUserData() {
        const auth = getAuth()
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userData = await readUserDataFromDb(
                    getAuth().currentUser!.uid
                )
                setUser(userData!)
                setIsLoading(false)
            }
        })
    }

    useEffect(() => {
        async function fetchData() {
            await fetchUserData()
        }
        fetchData()
    }, [])

    useEffect(() => {
        const hideFiltersContainer = () => {
            const filtersContainer =
                document.getElementById('filters-container')
            if (filtersContainer) {
                filtersContainer.classList.add('visibility-hidden')
            }
        }
        hideFiltersContainer()
    }, [user])

    return (
        <div id="placeholder-body">
            <ToolBar />
            <div id="placeholder-content">
                <NavBar currentPage={'placeholder'} />
                <div id="placeholder-main">
                    <ActionBar />
                    <div id="placeholder-main-content"></div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Placeholder
