// --------------------------------------------------------------
// Category class definition.
// --------------------------------------------------------------

import { Task } from './Task'

export class Category {
    name: string
    tasks: Task[]

    constructor(name: string, tasks: Task[] = []) {
        this.name = name
        this.tasks = tasks
    }
}
