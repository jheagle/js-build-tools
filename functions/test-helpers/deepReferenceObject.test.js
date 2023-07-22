const deepReferenceObject = require('./deepReferenceObject')

describe('deepReferenceObject', () => {
  test('has sample deep reference object', () => {
    expect(deepReferenceObject).toHaveProperty('object1.object2.array1')
  })
})
