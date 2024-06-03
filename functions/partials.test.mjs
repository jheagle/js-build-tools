import * as partials from './partials.mjs'

describe('partials', () => {
  test('is object with all partial exports', () => {
    expect(Object.keys(partials).length).toBe(14)
  })
})
