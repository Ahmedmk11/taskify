import { User } from '../app/User'
import { Task } from '../app/Task'
import { parseDateFromString } from '../app/Functions'

describe('User', () => {
    let user: User
    let task: Task

    beforeEach(() => {
        task = new Task('0', 'Task 1', 'Description', 'high', '8 Aug 2023')
        user = new User('Ahmed', 'ahmed@gmail.com', [], [])
        user.taskArray.push(task)
    })

    it('should create a new task for the user', () => {
        user.taskArray.push(
            new Task('Task 2', '0', 'Description', 'low', '8 Aug 2023')
        )
        expect(user.taskArray.length).toBe(2)
    })

    it('should show low priority tasks only', () => {
        user.taskArray.push(
            new Task('Task 2', '1', 'Description', 'low', '8 Aug 2023')
        )
        user.taskArray.push(
            new Task('Task 3', '2', 'Description', 'low', '8 Aug 2023')
        )
        const res = user.filterTasksByPriority(user.taskArray, 'low')
        expect(res.length).toBe(2)
        expect(user.taskArray.length).toBe(3)
    })

    it('should show medium priority tasks only', () => {
        user.taskArray.push(
            new Task('Task 2', '1', 'Description', 'medium', '8 Aug 2023')
        )
        user.taskArray.push(
            new Task('Task 3', '2', 'Description', 'medium', '8 Aug 2023')
        )
        const res = user.filterTasksByPriority(user.taskArray, 'medium')
        expect(res.length).toBe(2)
        expect(user.taskArray.length).toBe(3)
    })

    it('should show high priority tasks only', () => {
        user.taskArray.push(
            new Task('Task 2', '1', 'Description', 'high', '8 Aug 2023')
        )
        user.taskArray.push(
            new Task('Task 3', '2', 'Description', 'low', '8 Aug 2023')
        )
        const res = user.filterTasksByPriority(user.taskArray, 'high')
        expect(res.length).toBe(2)
        expect(user.taskArray.length).toBe(3)
    })

    // it('should show tasks due on a certain day only', () => {
    //     user.taskArray.push(new Task(
    //         'Task 2',
    //         '1',
    //         'Description',
    //         'low',
    //         '8 Aug 2023')
    //     )
    //     user.taskArray.push(new Task(
    //         'Task 3',
    //         '2',
    //         'Description',
    //         'low',
    //         '8 Aug 2023')
    //     )
    //     const res = user.filterTasksByDate(
    //         user.taskArray,
    //         parseDateFromString('8 Aug 2023')
    //     )
    //     expect(res.length).toBe(1)
    //     expect(user.taskArray.length).toBe(3)
    // })
})
