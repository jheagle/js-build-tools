const fs = require('fs')
const del = require('del')
const gulpConfig = require('../gulp.config.js')
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

/**
 * Ensure that the del has completed, recursively attempt to delete and recreate
 * @param exists
 * @returns {Promise<*|void>}
 */
const createTempDir = async (exists) => {
  if (exists) {
    return del(tempDir)
      .then(() => createTempDir(fs.existsSync(tempDir)))
  }
  await fs.mkdirSync(tempDir)
  return fs.mkdirSync(srcPath)
}

exports.beforeEach = () => createTempDir(true)

exports.afterEach = async () => await del(tempDir)
