// Import the configurations and override some of them to direct to the temp directory.
import * as gulpConfig from '../../gulp.config.mjs'
import { setUp } from 'test-filesystem'

let tempDir = 'test-temp/'
let srcPath = `${tempDir}src`

/**
 * Update the gulp configurations with the test data. Set the test directory where temp files will be created for testing.
 * @memberOf module:testHelpers
 * @param {string} testDir
 */
export const setDefaults = (testDir = 'test-temp') => {
  tempDir = `${testDir}/`
  srcPath = `${tempDir}src`
  setUp.setDefaults(tempDir)
  const distPath = `${tempDir}dist`
  const browserPath = `${tempDir}browser`
  const sassPath = `${tempDir}sass`
  gulpConfig.set('browser.from', `${distPath}/**/*.js`)
  gulpConfig.set('browser.to', browserPath)
  gulpConfig.set('cleanPaths', [distPath, browserPath])
  gulpConfig.set('dist.from', `${srcPath}/**/!(*.test).js`)
  gulpConfig.set('dist.main', `${distPath}/main`)
  gulpConfig.set('dist.to', distPath)
  // Reset explicitly, for the same reason as readme.fromEsm below: this project's own build-tools.config.json turns
  // docs on and points them at the website checkout, which would leak into every test that never sets these itself.
  gulpConfig.set('docs.enabled', false)
  gulpConfig.set('docs.from', srcPath)
  gulpConfig.set('docs.to', `${tempDir}docs`)
  gulpConfig.set('docs.title', '')
  gulpConfig.set('fonts.from', `${srcPath}/fonts/**/*`)
  gulpConfig.set('fonts.to', `${browserPath}/fonts`)
  gulpConfig.set('images.from', `${srcPath}/img/**/*.+(png|jpg|jpeg|gif|svg)`)
  gulpConfig.set('images.to', `${browserPath}/img`)
  gulpConfig.set('readme.template', `${tempDir}MAIN.md`)
  gulpConfig.set('readme.to', tempDir)
  gulpConfig.set('readme.from', `${srcPath}/**/!(*.test).js`)
  // Reset explicitly: gulpConfig is a process-wide singleton seeded once from this real project's own
  // build-tools.config.json, so without this, this project's own real readme.fromEsm value (gulp.config.mjs)
  // would leak into every test that exercises addToReadme/compileReadme but never sets this path itself -
  // doing real file I/O and a real jsdoc-to-markdown parse of this project's own, much larger, config file.
  gulpConfig.set('readme.fromEsm', [])
  gulpConfig.set('rootPath', tempDir)
  gulpConfig.set('sass.from', `${sassPath}/**/*.+(scss|sass)`)
  gulpConfig.set('sass.path', sassPath)
  gulpConfig.set('sass.to', `${browserPath}/css`)
  gulpConfig.set('srcPath', srcPath)
  gulpConfig.set('typescript.from', `${srcPath}/**/*.ts`)
  gulpConfig.set('typescript.to', distPath)
  gulpConfig.set('test.watch', `${srcPath}/**/*.js`)
}

export { gulpConfig }

export {
  /**
   * Ensure that the del has completed, recursively attempt to delete and recreate
   * @memberOf module:testHelpers
   * @param {boolean} [exists=true]
   * @returns {Promise<*|void>}
   */
    createTempDir,
  /**
   * In the Jest.beforeEach function call this one to set up the temp directory.
   * @memberOf module:testHelpers
   * @returns {Promise<*|void>}
   */
    beforeEach,
  /**
   * In the Jest.afterEach function call this one to clean up and remove the temp directory.
   * @memberOf module:testHelpers
   * @returns {Promise<*>}
   */
    afterEach,
  /**
   * Return number of occurrences of substring in another string.
   * @memberOf module:testHelpers
   * @returns {int}
   */
    countMatches,
  /**
   * Returns true if the given file or directory exists, otherwise false.
   * @memberOf module:testHelpers
   * @returns {boolean}
   */
    fileExists,
  /**
   * Console log objects in a readable format, returns the given object.
   * @memberOf module:testHelpers
   * @returns {*}
   */
    logObject,
  /**
   * Delete a directory and subcontents.
   * @memberOf module:testHelpers
   * @returns {Promise<*>}
   */
    removeDirectory,
} from 'test-filesystem'
