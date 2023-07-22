import circularObject from './circurlarObject'

describe('circurlarObject', () => {
  test('has sample circular object', () => {
    expect(circularObject.body.parent).toBe(circularObject)
    expect(circularObject.body.children[0].parent).toBe(circularObject.body)
    expect(circularObject.body.children[1].parent).toBe(circularObject.body)
    expect(circularObject.children[0]).toBe(circularObject.body)
    expect(circularObject.head.parent).toBe(circularObject)
    expect(circularObject.head.children[0].parent).toBe(circularObject.head)
    expect(circularObject.head.children[1].parent).toBe(circularObject.head)
    expect(circularObject.children[1]).toBe(circularObject.head)
  })
})
