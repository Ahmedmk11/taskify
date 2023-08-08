// Definitions of Functions and Classes

export class Task {
    title: string
    desc: string
    priority: string
    due: Date
    isDeleted: boolean

    constructor(title: string, desc: string, priority: string, due: Date) {
        this.title = title
        this.desc = desc
        this.priority = priority
        this.due = due
        this.isDeleted = false
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

    updateDue(newDue: Date): void {
        this.due = newDue
    }

    delete(): void {
        this.isDeleted = true
    }
}
