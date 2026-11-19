import * as gulpConfig from '../gulp.config.mjs'
import { runCLI } from 'jest'

/**
 * Run all tests with jest.
 * Configure where tests are located by using 'testPath'.
 * @memberOf module:js-build-tools
 * @returns {Promise<Object>} Jest's aggregated results, when every test passed; rejects when any failed.
 */
export const testFull = async () => {
  let testPath = gulpConfig.get('test.path')
  if (!Array.isArray(testPath)) {
    // The testPath must be an array of strings
    testPath = [testPath]
  }
  const { results } = await runCLI(gulpConfig.get('test.options'), testPath)
  // runCLI only reports the results; without this, a failing test still let `gulp testFull` (and npm test) exit 0
  if (!results.success) {
    throw new Error(`${results.numFailedTests} test(s) failed in ${results.numFailedTestSuites} suite(s)`)
  }
  return results
}
