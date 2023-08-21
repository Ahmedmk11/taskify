// --------------------------------------------------------------
// User class definition.
// --------------------------------------------------------------

import { Task } from './Task'

export class User {
    name: string
    email: string
    taskArray: Task[]
    categories: string[]

    constructor(name: string, email: string, taskArray: Task[], categories: string[]) {
        this.name = name
        this.email = email
        this.taskArray = taskArray
        this.categories = categories
    }

    createTask(
        title: string,
        desc?: string,
        priority?: string,
        dueDate?: Date
    ): void
    createTask(task: Task): void
    createTask(
        titleOrTask: string | Task,
        desc?: string,
        priority?: string,
        dueDate?: Date
    ): void {
        if (titleOrTask instanceof Task) {
            this.taskArray.push(titleOrTask)
        } else {
            const newTask = new Task(titleOrTask, desc!, priority!, dueDate!)
            this.taskArray.push(newTask)
        }
    }

    deleteTask(task: Task): void {
        const index = this.taskArray.indexOf(task)
        if (index > -1) {
            this.taskArray.splice(index, 1)
        }
    }

    startTask(task: Task): void {
        task.startTask()
    }

    closeTask(task: Task): void {
        task.closeTask()
    }

    addCategory(category: string): void {
        this.categories.push(category)
    }

    filterTasksByPriority(tasks: Task[], priority: string): Task[] {
        return tasks.filter((task) => task.priority === priority)
    }

    filterTasksByDate(tasks: Task[], date: Date): Task[] {
        return tasks.filter((task) => task.dueDate.getTime() === date.getTime())
    }
}
