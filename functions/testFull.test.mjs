import { jest } from '@jest/globals'
import { testHelpers } from './testHelpers.mjs'

const gulpConfig = testHelpers.gulpConfig

jest.unstable_mockModule('jest', () => ({
  runCLI: jest.fn()
}))

const { testFull } = await import('./testFull.mjs')
const { runCLI } = await import('jest')

describe('testFull', () => {
  test('runs the Jest CLI with the configured options and resolves with the results when every test passed', async () => {
    const results = { success: true, numFailedTests: 0, numFailedTestSuites: 0 }
    runCLI.mockResolvedValueOnce({ results })
    await expect(testFull()).resolves.toBe(results)
    expect(runCLI).toHaveBeenCalledWith(gulpConfig.get('test.options'), [gulpConfig.get('test.path')])
  })

  test('rejects when any test failed, so the gulp task and npm test fail', async () => {
    runCLI.mockResolvedValueOnce({ results: { success: false, numFailedTests: 2, numFailedTestSuites: 1 } })
    await expect(testFull()).rejects.toThrow('2 test(s) failed in 1 suite(s)')
  })
})
