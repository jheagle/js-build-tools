const { setUp } = require('./testHelpers')
const gulpConfig = setUp.gulpConfig
const { runCLI } = require('jest')
const testQuick = require('./testQuick')

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
