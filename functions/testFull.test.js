const { setUp } = require('./testHelpers')
const gulpConfig = setUp.gulpConfig
const { runCLI } = require('jest')
const testFull = require('./testFull')

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
