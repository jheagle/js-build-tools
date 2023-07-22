const jsonDom = require('./jsonDom')

describe('jsonDom', () => {
  test('has sample jsonDom object', () => {
    expect(jsonDom).toHaveProperty('attributes')
    expect(jsonDom).toHaveProperty('children')
    expect(jsonDom).toHaveProperty('element')
    expect(jsonDom).toHaveProperty('eventListeners')
    expect(jsonDom).toHaveProperty('parentItem')
    expect(jsonDom).toHaveProperty('tagName')
  })
})
