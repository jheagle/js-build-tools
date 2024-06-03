import { testHelpers } from './testHelpers.mjs'
import { default as jestImport } from 'jest'
import { testQuick } from './testQuick.mjs'

const gulpConfig = testHelpers.gulpConfig

jest.mock('jest', () => ({
  'runCLI': jest.fn(() => Promise.resolve(true))
}))

describe('testQuick', () => {
  test('runs the jest CLI with onlyChanged option', () => {
    expect.assertions(1)
    testQuick()
    expect(jestImport.runCLI).toHaveBeenCalledWith({ onlyChanged: true }, [gulpConfig.get('test.path')])
  })
})
