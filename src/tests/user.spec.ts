import { User, Task } from '../app'

describe('User', () => {
    let user: User
    let task: Task

    beforeEach(() => {
        task = new Task('Task 1', 'Description', 'High', new Date('2023-08-08'))
        user = new User('Ahmed', 'ahmed@gmail.com', '123', [], [])
        user.createTask(task)
    })

    it('should create a new task for the user', () => {
        user.createTask('Task 2', 'Description', 'Low', new Date('2023-08-08'))
        expect(user.inProgressTasks.length).toBe(2)
    })

    it('should create a new task for the user using a defined task', () => {
        const newTask = new Task('Task 2', 'Description', 'High', new Date('2023-08-08'))
        user.createTask(newTask)
        expect(user.inProgressTasks.length).toBe(2)
    })

    it('should delete a task for the user', () => {
        user.deleteTask(task)
        if (task.isCompleted) {
            expect(user.completedTasks.length).toBe(0)
        } else {
            expect(user.inProgressTasks.length).toBe(0)
        }
    })

    it('should complete a task for the user', () => {
        user.completeTask(task)
        expect(user.inProgressTasks.length).toBe(0)
        expect(user.completedTasks.length).toBe(1)
    })

    it('should uncomplete a task for the user', () => {
        user.completeTask(task)
        expect(user.inProgressTasks.length).toBe(0)
        expect(user.completedTasks.length).toBe(1)
        user.unCompleteTask(task)
        expect(user.inProgressTasks.length).toBe(1)
        expect(user.completedTasks.length).toBe(0)
    })

    it('should sort tasks by title ascendingly', () => {
        const task2 = new Task('Task 2', 'Description', 'High', new Date('2023-08-08'))
        const task3 = new Task('z Task 3', 'Description', 'High', new Date('2023-08-08'))
        const tasks = [task2, task, task3]
        const sortedTasks = user.sortTasksByTitle(tasks, true)
        expect(sortedTasks[0]).toBe(task)
        expect(sortedTasks[1]).toBe(task2)
        expect(sortedTasks[2]).toBe(task3)
    })

    it('should sort tasks by title descendingly', () => {
        const task2 = new Task('Task 2', 'Description', 'High', new Date('2023-08-08'))
        const task3 = new Task('z Task 3', 'Description', 'High', new Date('2023-08-08'))
        const tasks = [task2, task, task3]
        const sortedTasks = user.sortTasksByTitle(tasks, false)
        expect(sortedTasks[0]).toBe(task3)
        expect(sortedTasks[1]).toBe(task2)
        expect(sortedTasks[2]).toBe(task)
    })

    it('should sort tasks by dueDate ascendingly', () => {
        const task2 = new Task('Task 2', 'Description', 'High', new Date('2023-08-09'))
        const task3 = new Task('Task 3', 'Description', 'High', new Date('2023-08-10'))
        const tasks = [task2, task, task3]
        const sortedTasks = user.sortTasksByDueDate(tasks, true)
        expect(sortedTasks[0]).toBe(task)
        expect(sortedTasks[1]).toBe(task2)
        expect(sortedTasks[2]).toBe(task3)
    })

    it('should sort tasks by dueDate descendingly', () => {
        const task2 = new Task('Task 2', 'Description', 'High', new Date('2023-08-09'))
        const task3 = new Task('Task 3', 'Description', 'High', new Date('2023-08-10'))
        const tasks = [task2, task, task3]
        const sortedTasks = user.sortTasksByDueDate(tasks, false)
        expect(sortedTasks[0]).toBe(task3)
        expect(sortedTasks[1]).toBe(task2)
        expect(sortedTasks[2]).toBe(task)
    })

    it('should sort tasks by priority ascendingly', () => { 
        const task2 = new Task('Task 2', 'Description', 'Low', new Date('2023-08-08'))
        const task3 = new Task('Task 3', 'Description', 'Medium', new Date('2023-08-08'))
        const tasks = [task2, task, task3]
        const sortedTasks = user.sortTasksByPriority(tasks, true)
        expect(sortedTasks[0]).toBe(task2)
        expect(sortedTasks[1]).toBe(task3)
        expect(sortedTasks[2]).toBe(task)
    })

    it('should sort tasks by priority descendingly', () => {
        const task2 = new Task('Task 2', 'Description', 'Low', new Date('2023-08-08'))
        const task3 = new Task('Task 3', 'Description', 'Medium', new Date('2023-08-08'))
        const tasks = [task2, task, task3]
        const sortedTasks = user.sortTasksByPriority(tasks, false)
        expect(sortedTasks[0]).toBe(task)
        expect(sortedTasks[1]).toBe(task3)
        expect(sortedTasks[2]).toBe(task2)
    })

    it('should show low priority tasks only', () => {
        user.createTask('Task 2', 'Description', 'Low', new Date('2023-08-08'))
        user.createTask('Task 3', 'Description', 'Low', new Date('2023-08-08'))
        const res = user.filterTasksByPriority(user.inProgressTasks, 'Low')
        expect(res.length).toBe(2)
        expect(user.inProgressTasks.length).toBe(3)
    })

    it('should show medium priority tasks only', () => {
        user.createTask('Task 2', 'Description', 'Medium', new Date('2023-08-08'))
        user.createTask('Task 3', 'Description', 'Medium', new Date('2023-08-08'))
        const res = user.filterTasksByPriority(user.inProgressTasks, 'Medium')
        expect(res.length).toBe(2)
        expect(user.inProgressTasks.length).toBe(3)
    })

    it('should show high priority tasks only', () => {
        user.createTask('Task 2', 'Description', 'High', new Date('2023-08-08'))
        user.createTask('Task 3', 'Description', 'Low', new Date('2023-08-08'))
        const res = user.filterTasksByPriority(user.inProgressTasks, 'High')
        expect(res.length).toBe(2)
        expect(user.inProgressTasks.length).toBe(3)
    })

    it('should show tasks due on a certain day only', () => {
        user.createTask('Task 2', 'Description', 'Low', new Date('2023-08-10'))
        user.createTask('Task 3', 'Description', 'Low', new Date('2023-08-09'))
        const res = user.filterTasksByDate(user.inProgressTasks, new Date('2023-08-08'))
        expect(res.length).toBe(1)
        expect(user.inProgressTasks.length).toBe(3)
    })

    it('should sort tasks by creation date ascendingly', () => {
        const task2 = new Task('Task 2', 'Description', 'Low', new Date('2023-08-10'))
        const task3 = new Task('Task 3', 'Description', 'Low', new Date('2023-08-09'))
        user.createTask(task3)
        user.createTask(task2)
        const sortedTasks = user.sortTasksByCreation(true)
        expect(sortedTasks[0]).toBe(task)
        expect(sortedTasks[1]).toBe(task3)
        expect(sortedTasks[2]).toBe(task2)
    })

    it('should sort tasks by creation date descendingly', () => {
        const task2 = new Task('Task 2', 'Description', 'Low', new Date('2023-08-10'))
        const task3 = new Task('Task 3', 'Description', 'Low', new Date('2023-08-09'))
        user.createTask(task3)
        user.createTask(task2)
        const sortedTasks = user.sortTasksByCreation(false)
        expect(sortedTasks[0]).toBe(task2)
        expect(sortedTasks[1]).toBe(task3)
        expect(sortedTasks[2]).toBe(task)
    })

    it('should update main category', () => {
        const task2 = new Task('Task 2', 'Description', 'Low', new Date('2023-08-10'))
        const task3 = new Task('Task 3', 'Description', 'Low', new Date('2023-08-09'))
        user.createTask(task2)
        user.createTask(task3)
        expect(user.categories.find(category => category.name === 'Main')?.tasks.length).toBe(3)
    })      
})
