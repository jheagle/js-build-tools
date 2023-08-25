const typeScript = require('./typeScript')
const tsFor = require('./tsFor')
jest.mock('./tsFor', () => jest.fn())

describe('typeScript', () => {
  test('calls tsFor with no parameters', () => {
    typeScript()
    expect(tsFor).toHaveBeenCalled()
  })
})
