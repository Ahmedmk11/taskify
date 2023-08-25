// --------------------------------------------------------------
// Task class definition.
// --------------------------------------------------------------

import { formatDate } from './Functions'

export class Task {
    id: string
    title: string
    desc: string
    priority: string
    dueDate: string
    creationDate: string
    status: string
    categories: string[]

    constructor(
        id: string,
        title: string,
        desc: string,
        priority: string,
        dueDate: string,
        status: string = 'todo'
    ) {
        this.id = id
        this.title = title
        this.desc = desc
        this.priority = priority
        this.dueDate = dueDate
        this.creationDate = formatDate(new Date())
        this.status = status
        this.categories = ['Main']
    }

    updateTitle(newTitle: string): void {
        this.title = newTitle
    }

    updateDesc(newDesc: string): void {
        this.desc = newDesc
    }

    updatePriority(newPriority: string): void {
        this.priority = newPriority
    }

    updatedueDate(newdueDate: string): void {
        this.dueDate = newdueDate
    }

    updateCategories(newCategories: string[]): void {
        this.categories = newCategories
    }

    updateStatus(newStatus: string): void {
        this.status = newStatus
    }
}
