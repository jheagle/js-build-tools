const typeScript = require('./typeScript')
const tsFor = require('./partials/tsFor')
jest.mock('./partials/tsFor', () => jest.fn(() => () => null))

describe('typeScript', () => {
  test('calls tsFor with no parameters', () => {
    typeScript()
    expect(tsFor).toHaveBeenCalled()
  })
})
