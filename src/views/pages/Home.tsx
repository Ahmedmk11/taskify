// --------------------------------------------------------------
// Home page frontend code.
// --------------------------------------------------------------

import React, { useState } from 'react'
import { Task } from '../../app'

function Home() {
    const task1 = new Task(
        'Task 1',
        'Finish task 1',
        '!!!',
        new Date('2024-01-01')
    )
    const task2 = new Task(
        'Task 2',
        'Finish task 2',
        '!',
        new Date('2023-09-03')
    )

    return <></>
}

export default Home
