const typeScript = require('./typeScript')
const tsFor = require('./partials/tsFor')
const { logObject } = require('./testHelpers')
jest.mock('./partials/tsFor', () => jest.fn(() => () => null))

describe('typeScript', () => {
  test('calls tsFor with no parameters', () => {
    logObject(typeScript, 'typescript')
    typeScript()
    expect(tsFor).toHaveBeenCalled()
  })
})
