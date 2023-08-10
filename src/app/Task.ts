// --------------------------------------------------------------
// Task class definition.
// --------------------------------------------------------------

export class Task {
    id: string
    title: string
    desc: string
    priority: string
    dueDate: Date
    isCompleted: boolean

    constructor(title: string, desc: string, priority: string, dueDate: Date) {
        this.id = Math.random().toString(36).substring(2, 9);
        this.title = title
        this.desc = desc
        this.priority = priority
        this.dueDate = dueDate
        this.isCompleted = false
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

    completeTask(): void {
        this.isCompleted = true
    }

    unCompleteTask(): void {
        this.isCompleted = false
    }
}
