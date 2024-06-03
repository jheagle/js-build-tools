// Import the configurations and override some of them to direct to the temp directory.
import * as gulpConfig from '../../gulp.config.mjs'
import * as setUp from 'test-filesystem'

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
  gulpConfig.set('fonts.from', `${srcPath}/fonts/**/*`)
  gulpConfig.set('fonts.to', `${browserPath}/fonts`)
  gulpConfig.set('images.from', `${srcPath}/img/**/*.+(png|jpg|jpeg|gif|svg)`)
  gulpConfig.set('images.to', `${browserPath}/img`)
  gulpConfig.set('readme.template', `${tempDir}MAIN.md`)
  gulpConfig.set('readme.to', tempDir)
  gulpConfig.set('readme.from', `${srcPath}/**/!(*.test).js`)
  gulpConfig.set('rootPath', tempDir)
  gulpConfig.set('sass.from', `${sassPath}/**/*.+(scss|sass)`)
  gulpConfig.set('sass.path', sassPath)
  gulpConfig.set('sass.to', `${browserPath}/css`)
  gulpConfig.set('srcPath', srcPath)
  gulpConfig.set('typescript.from', `${srcPath}/**/*.ts`)
  gulpConfig.set('typescript.to', distPath)
  gulpConfig.set('test.watch', `${srcPath}/**/*.js`)
}

export { gulpConfig, setUp }

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
    afterEach
} from 'test-filesystem'
