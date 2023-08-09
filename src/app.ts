// --------------------------------------------------------------
// Definitions of Functions and Classes.
// --------------------------------------------------------------

import cloneDeep from 'clone-deep'

export class Category {
    name: string
    tasks: Task[]

    constructor(name: string, tasks: Task[] = []) {
        this.name = name
        this.tasks = tasks
    }
}

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

export class User {
    name: string
    email: string
    password: string
    inProgressTasks: Task[]
    completedTasks: Task[]
    inOrderTasks: Task[]
    categories: Category[]

    constructor(name: string, email: string, password: string, inProgressTasks: Task[], completedTasks: Task[]) {
        this.name = name
        this.email = email
        this.password = password
        this.inProgressTasks = inProgressTasks
        this.completedTasks = completedTasks
        this.inOrderTasks = []
        this.categories = [new Category('Main')]
    }

    updateMainCategory(): void {
        const mainCategory = this.categories.find(category => category.name === 'Main');
        if (mainCategory) {
            mainCategory.tasks = this.inProgressTasks.concat(this.completedTasks);
        }
    }    

    createTask(title: string, desc?: string, priority?: string, dueDate?: Date): void;
    createTask(task: Task): void;
    createTask(titleOrTask: string | Task, desc?: string, priority?: string, dueDate?: Date): void {
        if (titleOrTask instanceof Task) {
            this.inProgressTasks.push(titleOrTask);
            this.inOrderTasks.push(titleOrTask) // this line creates an error
        } else {
            const newTask = new Task(titleOrTask, desc!, priority!, dueDate!);
            this.inProgressTasks.push(newTask);
            this.inOrderTasks.push(newTask)
        }
        this.updateMainCategory()
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
        this.inOrderTasks.splice(this.inOrderTasks.indexOf(task), 1)
        this.updateMainCategory()
    }

    completeTask(task: Task): void {
        task.completeTask()
        this.inProgressTasks.splice(this.inProgressTasks.indexOf(task), 1)
        this.completedTasks.push(task)
        this.updateMainCategory()
    }

    unCompleteTask(task: Task): void {
        task.unCompleteTask()
        this.completedTasks.splice(this.completedTasks.indexOf(task), 1)
        this.inProgressTasks.push(task)
        this.updateMainCategory()
    }

    addCategory(category: Category): void {
        this.categories.push(category)
    }

    addTaskToCategory(category: Category, task: Task): void {
        category.tasks.push(task)
    }

    sortTasksByCreation(isAscending: boolean): Task[] {
        return (isAscending) ? this.inOrderTasks : this.inOrderTasks.reverse()
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
