import { jest } from '@jest/globals'
import { testHelpers } from './testHelpers.mjs'

const gulpConfig = testHelpers.gulpConfig

jest.unstable_mockModule('jest', () => ({
  runCLI: jest.fn(() => Promise.resolve(true))
}))

const { testQuick } = await import('./testQuick.mjs')
const { runCLI } = await import('jest')

describe('testQuick', () => {
  test('runs the jest CLI with onlyChanged option', () => {
    expect.assertions(1)
    testQuick()
    expect(runCLI).toHaveBeenCalledWith({ onlyChanged: true }, [gulpConfig.get('test.path')])
  })
})
