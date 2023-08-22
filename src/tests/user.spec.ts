import { User } from '../app/User'
import { Task } from '../app/Task'

describe('User', () => {
    let user: User
    let task: Task

    beforeEach(() => {
        task = new Task(
            '0',
            'Task 1',
            'Description',
            'high',
            new Date('2023-08-08')
        )
        user = new User('Ahmed', 'ahmed@gmail.com', [], [])
        user.createTask(task)
    })

    it('should create a new task for the user', () => {
        user.createTask(
            'Task 2',
            '0',
            'Description',
            'low',
            new Date('2023-08-08')
        )
        expect(user.taskArray.length).toBe(2)
    })

    it('should create a new task for the user using a defined task', () => {
        const newTask = new Task(
            '1',
            'Task 2',
            'Description',
            'high',
            new Date('2023-08-08')
        )
        user.createTask(newTask)
        expect(user.taskArray.length).toBe(2)
    })

    it('should delete a task for the user', () => {
        user.deleteTask(task)
        expect(user.taskArray.length).toBe(0)
    })

    it('should start a task for the user', () => {
        user.startTask(task)
        expect(task.status).toBe('inprogress')
    })

    it('should close a task for the user', () => {
        user.closeTask(task)
        expect(task.status).toBe('done')
    })

    it('should show low priority tasks only', () => {
        user.createTask(
            'Task 2',
            '1',
            'Description',
            'low',
            new Date('2023-08-08')
        )
        user.createTask(
            'Task 3',
            '2',
            'Description',
            'low',
            new Date('2023-08-08')
        )
        const res = user.filterTasksByPriority(user.taskArray, 'low')
        expect(res.length).toBe(2)
        expect(user.taskArray.length).toBe(3)
    })

    it('should show medium priority tasks only', () => {
        user.createTask(
            'Task 2',
            '1',
            'Description',
            'medium',
            new Date('2023-08-08')
        )
        user.createTask(
            'Task 3',
            '2',
            'Description',
            'medium',
            new Date('2023-08-08')
        )
        const res = user.filterTasksByPriority(user.taskArray, 'medium')
        expect(res.length).toBe(2)
        expect(user.taskArray.length).toBe(3)
    })

    it('should show high priority tasks only', () => {
        user.createTask(
            'Task 2',
            '1',
            'Description',
            'high',
            new Date('2023-08-08')
        )
        user.createTask(
            'Task 3',
            '2',
            'Description',
            'low',
            new Date('2023-08-08')
        )
        const res = user.filterTasksByPriority(user.taskArray, 'high')
        expect(res.length).toBe(2)
        expect(user.taskArray.length).toBe(3)
    })

    it('should show tasks due on a certain day only', () => {
        user.createTask(
            'Task 2',
            '1',
            'Description',
            'low',
            new Date('2023-08-10')
        )
        user.createTask(
            'Task 3',
            '2',
            'Description',
            'low',
            new Date('2023-08-09')
        )
        const res = user.filterTasksByDate(
            user.taskArray,
            new Date('2023-08-08')
        )
        expect(res.length).toBe(1)
        expect(user.taskArray.length).toBe(3)
    })
})
