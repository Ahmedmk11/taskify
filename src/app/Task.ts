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

    constructor(title: string, desc: string, priority: string, dueDate: Date) {
        this.id = Math.random().toString(36).substring(2, 9)
        this.title = title
        this.desc = desc
        this.priority = priority
        this.dueDate = dueDate
        this.creationDate = new Date()
        this.status = 'open'
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

    unStartTask(): void {
        this.status = 'open'
    }

    startTask(): void {
        this.status = 'inprogress'
    }

    closeTask(): void {
        this.status = 'done'
    }
}
