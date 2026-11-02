import { jest } from '@jest/globals'
import { testHelpers } from './testHelpers.mjs'

const gulpConfig = testHelpers.gulpConfig

jest.unstable_mockModule('jest', () => ({
  runCLI: jest.fn(() => Promise.resolve(true))
}))

const { testFull } = await import('./testFull.mjs')
const { runCLI } = await import('jest')

describe('testFull', () => {
  test('runs the Jest CLI with the configured options', () => {
    expect.assertions(1)
    testFull()
    expect(runCLI).toHaveBeenCalledWith(gulpConfig.get('test.options'), [gulpConfig.get('test.path')])
  })
})
