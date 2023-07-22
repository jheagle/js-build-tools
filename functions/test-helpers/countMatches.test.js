const countMatches = require('./countMatches')

describe('countMatches', () => {
  test('can get count of string occurrences', () => {
    const find = 'find me'
    const sampleString = `${find} in some string that could change the times ${find} will occur here, ${find} should be found three times`
    expect(countMatches(sampleString, find)).toBe(3)
  })
})
