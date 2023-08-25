// --------------------------------------------------------------
// Task class definition.
// --------------------------------------------------------------

export class Task {
    id: string
    title: string
    desc: string
    priority: string
    dueDate: Date
    creationDate: Date
    status: string
    categories: string[]

    constructor(
        id: string,
        title: string,
        desc: string,
        priority: string,
        dueDate: Date
    ) {
        this.id = id
        this.title = title
        this.desc = desc
        this.priority = priority
        this.dueDate = dueDate
        this.creationDate = new Date()
        this.status = 'todo'
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

    updatedueDate(newdueDate: Date): void {
        this.dueDate = newdueDate
    }

    updateCategories(newCategories: string[]): void {
        this.categories = newCategories
    }

    updateStatus(newStatus: string): void {
        this.status = newStatus
    }
}
