import { testHelpers } from './testHelpers.mjs'
import { runCLI } from 'jest'
import { testFull } from './testFull.mjs'

const gulpConfig = testHelpers.gulpConfig

jest.mock('jest', () => ({
  'runCLI': jest.fn(() => Promise.resolve(true))
}))

describe('testFull', () => {
  test('runs the Jest CLI with the configured options', () => {
    expect.assertions(1)
    testFull()
    expect(runCLI).toHaveBeenCalledWith(gulpConfig.get('test.options'), [gulpConfig.get('test.path')])
  })
})
