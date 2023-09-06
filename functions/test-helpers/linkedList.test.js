const linkedList = require('./linkedList')

describe('linkedList', () => {
  test('has sample linkedList object', () => {
    expect(linkedList.name).toBe('one')
    expect(linkedList).toHaveProperty('prev')
    expect(linkedList.prev).toBeNull()

    expect(linkedList).toHaveProperty('next')
    expect(linkedList.next.name).toBe('two')
    expect(linkedList).toHaveProperty('next.prev')
    expect(linkedList.next.prev).toBe(linkedList)

    expect(linkedList).toHaveProperty('next.next')
    expect(linkedList.next.next.name).toBe('three')
    expect(linkedList).toHaveProperty('next.prev')
    expect(linkedList.next.next.prev).toBe(linkedList.next)

    expect(linkedList).toHaveProperty('next.next.next')
    expect(linkedList.next.next.next).toBeNull()
  })
})
