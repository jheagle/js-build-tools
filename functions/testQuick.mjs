import * as gulpConfig from '../gulp.config.mjs'
import { default as jest } from 'jest'

/**
 * Run the Jest tests for files which have been modified (based on git status).
 * Configure where tests are located by using 'testPath'.
 * @memberOf module:js-build-tools
 * @returns {Promise<*>}
 */
export const testQuick = () => {
  let testPath = gulpConfig.get('test.path')
  if (!Array.isArray(testPath)) {
    // The testPath must be an array of strings
    testPath = [testPath]
  }
  return jest.runCLI({ onlyChanged: true }, testPath)
}
