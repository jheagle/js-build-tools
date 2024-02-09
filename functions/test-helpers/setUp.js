// Import the configurations and override some of them to direct to the temp directory.
const gulpConfig = require('../../gulp.config.js')
const { setUp } = require('test-filesystem')

let tempDir = 'test-temp/'
let srcPath = `${tempDir}src`

/**
 * Update the gulp configurations with the test data. Set the test directory where temp files will be created for testing.
 * @memberOf module:testHelpers
 * @param {string} testDir
 */
const setDefaults = (testDir = 'test-temp') => {
  tempDir = `${testDir}/`
  srcPath = `${tempDir}src`
  setUp.setDefaults(tempDir)
  const distPath = `${tempDir}dist`
  const browserPath = `${tempDir}browser`
  const sassPath = `${tempDir}sass`
  gulpConfig.set('browserPath', browserPath)
  gulpConfig.set('cleanPaths', [distPath, browserPath])
  gulpConfig.set('cssPath', `${browserPath}/css`)
  gulpConfig.set('distMain', `${distPath}/main`)
  gulpConfig.set('distPath', distPath)
  gulpConfig.set('distSearch', `${distPath}/**/*.js`)
  gulpConfig.set('fontDest', `${browserPath}/fonts`)
  gulpConfig.set('fontSearch', `${srcPath}/fonts/**/*`)
  gulpConfig.set('imageDest', `${browserPath}/img`)
  gulpConfig.set('imageSearch', `${srcPath}/img/**/*.+(png|jpg|jpeg|gif|svg)`)
  gulpConfig.set('readmeTemplate', `${tempDir}MAIN.md`)
  gulpConfig.set('readmePath', tempDir)
  gulpConfig.set('readmeSearch', `${srcPath}/**/!(*.test).js`)
  gulpConfig.set('rootPath', tempDir)
  gulpConfig.set('sassPath', sassPath)
  gulpConfig.set('sassSearch', `${sassPath}/**/*.+(scss|sass)`)
  gulpConfig.set('srcPath', srcPath)
  gulpConfig.set('srcSearch', `${srcPath}/**/!(*.test).js`)
  gulpConfig.set('tsSearch', `${srcPath}/**/*.ts`)
  gulpConfig.set('watchSearch', `${srcPath}/**/*.js`)
}

exports.setDefaults = setDefaults

exports.gulpConfig = gulpConfig

/**
 * Ensure that the del has completed, recursively attempt to delete and recreate
 * @memberOf module:testHelpers
 * @param {boolean} [exists=true]
 * @returns {Promise<*|void>}
 */
exports.createTempDir = setUp.createTempDir

/**
 * In the Jest.beforeEach function call this one to set up the temp directory.
 * @memberOf module:testHelpers
 * @returns {Promise<*|void>}
 */
exports.beforeEach = setUp.beforeEach

/**
 * In the Jest.afterEach function call this one to clean up and remove the temp directory.
 * @memberOf module:testHelpers
 * @returns {Promise<*>}
 */
exports.afterEach = setUp.afterEach
