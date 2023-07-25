const fs = require('fs')
const del = require('del')
// Import the configurations and override some of them in order to direct to the temp directory.
const gulpConfig = require('../../gulp.config.js')
const tempDir = 'test-temp/'
const srcPath = `${tempDir}src`
gulpConfig.set('browserPath', `${tempDir}browser`)
gulpConfig.set('distMain', `${tempDir}dist/main`)
gulpConfig.set('distPath', `${tempDir}dist`)
gulpConfig.set('distSearch', `${tempDir}dist/**/*.js`)
gulpConfig.set('readmeTemplate', `${tempDir}MAIN.md`)
gulpConfig.set('readmePath', tempDir)
gulpConfig.set('rootPath', tempDir)
gulpConfig.set('srcPath', srcPath)
gulpConfig.set('srcSearch', `${tempDir}src/**/!(*.test).js`)
gulpConfig.set('watchSearch', `${tempDir}src/**/*.js`)

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
    return del(tempDir)
      .then(() => createTempDir(fs.existsSync(tempDir)))
  }
  await fs.mkdirSync(tempDir)
  return fs.mkdirSync(srcPath)
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
exports.afterEach = async () => await del(tempDir)
