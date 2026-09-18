import { testHelpers } from './testHelpers.mjs'
import { runCLI } from 'jest'
import { testQuick } from './testQuick.mjs'

const gulpConfig = testHelpers.gulpConfig

jest.mock('jest', () => ({
  'runCLI': jest.fn(() => Promise.resolve(true))
}))

describe('testQuick', () => {
  test('runs the jest CLI with onlyChanged option', () => {
    expect.assertions(1)
    testQuick()
    expect(runCLI).toHaveBeenCalledWith({ onlyChanged: true }, [gulpConfig.get('test.path')])
  })
})
