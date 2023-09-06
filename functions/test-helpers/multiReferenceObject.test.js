const multiReferenceObject = require('./multiReferenceObject')

describe('multiReferenceObject', () => {
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
})
