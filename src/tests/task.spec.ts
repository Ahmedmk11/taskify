import { Task } from '../app/Task'

describe('Task', () => {
    let task: Task

    beforeEach(() => {
        task = new Task('Task 1', 'Description', 'Low', new Date('2023-08-08'))
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
        task.updatePriority('High')
        expect(task.priority).toBe('High')
    })

    it('should update task dueDate date', () => {
        const newdueDateDate = new Date('2023-09-09')
        task.updatedueDate(newdueDateDate)
        expect(task.dueDate).toEqual(newdueDateDate)
    })

    it('should start task', () => {
        task.startTask()
        expect(task.status).toBe('inprogress')
    })

    it('should pause task', () => {
        task.pauseTask()
        expect(task.status).toBe('pending')
    })

    it('should close task', () => {
        task.closeTask()
        expect(task.status).toBe('closed')
    })
})
