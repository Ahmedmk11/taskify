import { Category } from '../app/Category'

describe('Task', () => {
    let category: Category

    beforeEach(() => {
        category = new Category('Work')
    })

    it('should do smth', () => {
        expect(1).toBe(1)
    })
})