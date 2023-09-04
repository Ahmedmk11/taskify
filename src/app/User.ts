// --------------------------------------------------------------
// User class definition.
// --------------------------------------------------------------

import { Task } from './Task'
import { parseDateFromString } from './Functions'

export class User {
    name: string
    email: string
    taskArray: Task[]
    categories: string[]
    columns: {}

    constructor(
        name: string,
        email: string,
        taskArray: Task[],
        categories: string[],
        columns: {}
    ) {
        this.name = name
        this.email = email
        this.taskArray = taskArray
        this.categories = categories
        this.columns = columns
    }

    addCategory(category: string): void {
        this.categories.push(category)
    }

    filterTasksByPriority(tasks: Task[], priority: string): Task[] {
        return tasks.filter((task) => task.priority === priority)
    }

    filterTasksByDate(tasks: Task[], date: Date): Task[] {
        return tasks.filter(
            (task) =>
                parseDateFromString(task.dueDate).getTime() === date.getTime()
        )
    }
}
