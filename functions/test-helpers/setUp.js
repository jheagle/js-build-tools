const fs = require('fs')
// Import the configurations and override some of them in order to direct to the temp directory.
const gulpConfig = require('../../gulp.config.js')
const { removeDirectory } = require('../partials')

let tempDir = 'test-temp/'
let srcPath = `${tempDir}src`

/**
 * Update the gulp configurations with the test data. Set the test directory where temp files will be created for testing.
 * @function
 * @memberOf module:testHelpers
 * @param {string} testDir
 */
const setDefaults = (testDir = 'test-temp') => {
  tempDir = `${testDir}/`
  srcPath = `${tempDir}src`
  const distPath = `${tempDir}dist`
  const browserPath = `${tempDir}browser`
  gulpConfig.set('browserPath', browserPath)
  gulpConfig.set('cleanPaths', [distPath, browserPath])
  gulpConfig.set('distMain', `${distPath}/main`)
  gulpConfig.set('distPath', distPath)
  gulpConfig.set('distSearch', `${distPath}/**/*.js`)
  gulpConfig.set('readmeTemplate', `${tempDir}MAIN.md`)
  gulpConfig.set('readmePath', tempDir)
  gulpConfig.set('readmeSearch', `${srcPath}/**/!(*.test).js`)
  gulpConfig.set('rootPath', tempDir)
  gulpConfig.set('srcPath', srcPath)
  gulpConfig.set('srcSearch', `${srcPath}/**/!(*.test).js`)
  gulpConfig.set('tsSearch', `${srcPath}/**/*.ts`)
  gulpConfig.set('watchSearch', `${srcPath}/**/*.js`)
}

exports.setDefaults = setDefaults

exports.gulpConfig = gulpConfig

/**
 * Ensure that the del has completed, recursively attempt to delete and recreate
 * @function
 * @memberOf module:testHelpers
 * @param {boolean} [exists=true]
 * @returns {Promise<*|void>}
 */
const createTempDir = async (exists = true) => {
  if (exists) {
    return removeDirectory(tempDir)
      .then(removedDir => createTempDir(fs.existsSync(removedDir)))
      .catch(error => console.error('Error: ', error))
  }
  return fs.mkdirSync(srcPath, { recursive: true })
}

exports.createTempDir = createTempDir

/**
 * In the Jest.beforeEach function call this one to set up the temp directory.
 * @function
 * @memberOf module:testHelpers
 * @returns {Promise<*|void>}
 */
exports.beforeEach = () => createTempDir()

/**
 * In the Jest.afterEach function call this one to clean up and remove the temp directory.
 * @function
 * @memberOf module:testHelpers
 * @returns {Promise<*>}
 */
exports.afterEach = () => removeDirectory(tempDir)
