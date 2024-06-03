import { typeScript } from './typeScript.mjs'
import { tsFor } from './partials/tsFor.mjs'

jest.mock('./partials/tsFor.mjs', () => ({ tsFor: jest.fn(() => () => null) }))

describe('typeScript', () => {
  test('calls tsFor with no parameters', () => {
    typeScript()
    expect(tsFor).toHaveBeenCalled()
  })
})
