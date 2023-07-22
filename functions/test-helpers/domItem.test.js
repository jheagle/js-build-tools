const domItem = require('./domItem')

describe('domItem', () => {
  test('has sample domItem object', () => {
    expect(domItem[0]).toHaveProperty('attributes')
    expect(domItem[0]).toHaveProperty('children')
    expect(domItem[0]).toHaveProperty('element')
    expect(domItem[0]).toHaveProperty('eventListeners')
    expect(domItem[0]).toHaveProperty('parentItem')
    expect(domItem[0]).toHaveProperty('tagName')
  })
})
