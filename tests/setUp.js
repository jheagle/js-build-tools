const fs = require('fs')
const del = require('del')
const gulpConfig = require('../gulp.config.js')
gulpConfig.set('browserPath', 'test-temp/browser')
gulpConfig.set('distMain', 'test-temp/dist/main')
gulpConfig.set('distPath', 'test-temp/dist')
gulpConfig.set('distSearch', 'test-temp/dist/**/*.js')
gulpConfig.set('readmeTemplate', 'test-temp/MAIN.md')
gulpConfig.set('readmePath', 'test-temp/README.md')
gulpConfig.set('srcPath', 'test-temp/src')
gulpConfig.set('srcSearch', 'test-temp/src/**/!(*.test).js')
gulpConfig.set('watchSearch', 'test-temp/src/**/*.js')

const tempDir = 'test-temp'

exports.beforeEach = () => del(tempDir)
  .then(() => fs.mkdirSync(tempDir))
  .then(() => fs.mkdirSync(gulpConfig.get('srcPath')))

exports.afterEach = () => del('test-temp')
