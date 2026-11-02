import { jest } from '@jest/globals'

jest.unstable_mockModule('./partials/tsFor.mjs', () => ({ tsFor: jest.fn(() => () => null) }))

const { typeScript } = await import('./typeScript.mjs')
const { tsFor } = await import('./partials/tsFor.mjs')

describe('typeScript', () => {
  test('calls tsFor with no parameters', () => {
    typeScript()
    expect(tsFor).toHaveBeenCalled()
  })
})
