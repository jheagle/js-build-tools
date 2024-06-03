import * as gulpConfig from '../gulp.config.mjs'
import { default as jest } from 'jest'

/**
 * Run all tests with jest.
 * Configure where tests are located by using 'testPath'.
 * @memberOf module:js-build-tools
 * @returns {Promise<*>}
 */
export const testFull = () => {
  let testPath = gulpConfig.get('test.path')
  if (!Array.isArray(testPath)) {
    // The testPath must be an array of strings
    testPath = [testPath]
  }
  return jest.runCLI(gulpConfig.get('test.options'), testPath)
}
