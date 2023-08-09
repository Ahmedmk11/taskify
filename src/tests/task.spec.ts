import { Task } from '../app'

describe('Task', () => {
    let task: Task

    beforeEach(() => {
        task = new Task('Task 1', 'Description', 'High', new Date('2023-08-08'))
    })

    it('should update task title', () => {
        task.updateTitle('New Title')
        expect(task.title).toBe('New Title')
    })

    it('should update task description', () => {
        task.updateDesc('New Description')
        expect(task.desc).toBe('New Description')
    })

    it('should update task priority', () => {
        task.updatePriority('Low')
        expect(task.priority).toBe('Low')
    })

    it('should update task dueDate date', () => {
        const newdueDateDate = new Date('2023-09-09')
        task.updatedueDate(newdueDateDate)
        expect(task.dueDate).toEqual(newdueDateDate)
    })

    it('should complete task', () => {
        task.completeTask()
        expect(task.isCompleted).toBe(true)
    })
})
