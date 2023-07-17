const {
  circularObject,
  deepReferenceObject,
  domItem,
  jsonDom,
  linkedList,
  logObject,
  multiReferenceObject,
  nodeTree
} = require('./testHelpers.js')
const util = require('util')

describe('testHelpers', () => {
  test('logObject: can nicely output objects', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(jest.fn())
    const inspectSpy = jest.spyOn(util, 'inspect')
    const someObject = { one: 1, two: 2, three: 3 }
    logObject(someObject, 'someObject')
    expect(inspectSpy).toHaveBeenCalledWith(someObject, false, null, true)
    expect(logSpy).toHaveBeenCalledWith('someObject', util.inspect(someObject, false, null, true))
  })

  test('logObject: output to string when that argument is provided', () => {
    const someObject = { one: 1, two: 2, three: 3 }
    const label = 'someObject'
    const result = logObject(someObject, label, 'string')
    expect(result).toEqual(`'${label}' | ` + JSON.stringify(someObject))
  })

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

  test('has sample deep reference object', () => {
    expect(deepReferenceObject).toHaveProperty('object1.object2.array1')
  })

  test('has sample domItem object', () => {
    expect(domItem[0]).toHaveProperty('attributes')
    expect(domItem[0]).toHaveProperty('children')
    expect(domItem[0]).toHaveProperty('element')
    expect(domItem[0]).toHaveProperty('eventListeners')
    expect(domItem[0]).toHaveProperty('parentItem')
    expect(domItem[0]).toHaveProperty('tagName')
  })

  test('has sample jsonDom object', () => {
    expect(jsonDom).toHaveProperty('attributes')
    expect(jsonDom).toHaveProperty('children')
    expect(jsonDom).toHaveProperty('element')
    expect(jsonDom).toHaveProperty('eventListeners')
    expect(jsonDom).toHaveProperty('parentItem')
    expect(jsonDom).toHaveProperty('tagName')
  })

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

  test('has sample multiReferenceObject object', () => {
    expect(multiReferenceObject).toHaveProperty('object1.name')
    expect(multiReferenceObject).toHaveProperty('object2.age')
    expect(multiReferenceObject).toHaveProperty('array1.0')
    expect(multiReferenceObject).toHaveProperty('array1.1')
    expect(multiReferenceObject).toHaveProperty('array2.0')
    expect(multiReferenceObject).toHaveProperty('array2.1')
    expect(multiReferenceObject).toHaveProperty('title')
    expect(multiReferenceObject).toHaveProperty('item')
  })

  test('has sample nodeTree object', () => {
    expect(nodeTree.name).toBe('one')
    expect(nodeTree.parent).toBeNull()
    expect(nodeTree.children.length).toBe(2)
    expect(nodeTree.children[0].name).toBe('child one')
    expect(nodeTree.children[0].parent).toBe(nodeTree)
    expect(nodeTree.children[0].children.length).toBe(1)
    expect(nodeTree.children[0].children[0].name).toBe('grandchild one')
    expect(nodeTree.children[0].children[0].parent).toBe(nodeTree.children[0])
    expect(nodeTree.children[0].children[0].children.length).toBe(0)
    expect(nodeTree.children[1].name).toBe('child two')
    expect(nodeTree.children[1].parent).toBe(nodeTree)
    expect(nodeTree.children[1].children.length).toBe(0)
  })
})
