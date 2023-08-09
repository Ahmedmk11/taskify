import { User, Task } from '../app'

describe('User', () => {
    let user: User
    let task: Task

    beforeEach(() => {
        task = new Task('Task 1', 'Description', 'High', new Date('2023-08-08'))
        user = new User('Ahmed', 'ahmed@gmail.com', '123', [task], [])
    })

    it('should create a new task for the user', () => {
        user.createTask('Task 2', 'Description', 'Low', new Date('2023-08-08'))
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
})
