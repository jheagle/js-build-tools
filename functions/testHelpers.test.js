const testHelpers = require('./testHelpers')

describe('testHelpers', () => {
  test('is object with all helper exports', () => {
    expect(Object.keys(testHelpers).length).toBe(1)
  })
})
