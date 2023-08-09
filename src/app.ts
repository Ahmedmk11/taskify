// --------------------------------------------------------------
// Definitions of Functions and Classes.
// --------------------------------------------------------------

export class Task {
    title: string
    desc: string
    priority: string
    dueDate: Date
    category: string
    isCompleted: boolean

    constructor(title: string, desc: string, category: string, priority: string, dueDate: Date) {
        this.title = title
        this.desc = desc
        this.category = category
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
}

export class User {
    name: string
    email: string
    password: string
    inProgressTasks: Task[]
    completedTasks: Task[]

    constructor(name: string, email: string, password: string, inProgressTasks: Task[], completedTasks: Task[]) {
        this.name = name
        this.email = email
        this.password = password
        this.inProgressTasks = inProgressTasks
        this.completedTasks = completedTasks
    }

    createTask(title: string, desc?: string, category?: string, priority?: string, dueDate?: Date): void;
    createTask(task: Task): void;
    createTask(titleOrTask: string | Task, desc?: string, category?: string, priority?: string, dueDate?: Date): void {
        if (titleOrTask instanceof Task) {
            this.inProgressTasks.push(titleOrTask);
        } else {
            const newTask = new Task(titleOrTask, desc!, category!, priority!, dueDate!);
            this.inProgressTasks.push(newTask);
        }
    }
    
    deleteTask(task: Task): void {
        if (task.isCompleted) {
            const index = this.completedTasks.indexOf(task)
            if (index > -1) {
                this.completedTasks.splice(index, 1)
            }
        } else {
            const index = this.inProgressTasks.indexOf(task)
            if (index > -1) {
                this.inProgressTasks.splice(index, 1)
            }
        }
    }

    completeTask(task: Task): void {
        task.completeTask()
        this.inProgressTasks.splice(this.inProgressTasks.indexOf(task), 1)
        this.completedTasks.push(task)
    }

    sortTasksByTitle(tasks: Task[], isAscending: boolean): Task[] {
        if (isAscending) {
            return tasks.sort((a, b) => {
                if (a.title < b.title) {
                    return -1
                } else if (a.title > b.title) {
                    return 1
                }
                return 0
            })
        }
        return tasks.sort((a, b) => {
            if (a.title > b.title) {
                return -1
            } else if (a.title < b.title) {
                return 1
            }
            return 0
        })
    }

    sortTasksByPriority(tasks: Task[], isAscending: boolean): Task[] {
        if (isAscending) {
            return tasks.sort((a, b) => {
                if (a.priority === 'Low') {
                    return -1
                } else if (a.priority === 'Medium') {
                    if (b.priority === 'Low') {
                        return 1
                    } else {
                        return -1
                    }
                } else {
                    return 1
                }
            })
        }
        return tasks.sort((a, b) => {
            if (a.priority === 'High') {
                return -1
            } else if (a.priority === 'Medium') {
                if (b.priority === 'High') {
                    return 1
                } else {
                    return -1
                }
            } else {
                return 1
            }
        })
    }

    sortTasksByDueDate(tasks: Task[], isAscending: boolean): Task[] {
        if (isAscending) {
            return tasks.sort((a, b) => {
                if (a.dueDate < b.dueDate) {
                    return -1
                } else if (a.dueDate > b.dueDate) {
                    return 1
                }
                return 0
            })
        }
        return tasks.sort((a, b) => {
            if (a.dueDate > b.dueDate) {
                return -1
            } else if (a.dueDate < b.dueDate) {
                return 1
            }
            return 0
        })
    }

    filterTasksByPriority(tasks: Task[], priority: string): Task[] {
        return tasks.filter(task => task.priority === priority)
    }

    filterTasksByDate(tasks: Task[], date: Date): Task[] {
        return tasks.filter(task => task.dueDate.getTime() === date.getTime());
    }
}
