const { dest } = require('gulp')
const gulpConfig = require('../gulp.config.js')
const ts = require('gulp-typescript')

const tsProject = ts.createProject(gulpConfig.get('useTsConfig'))
/**
 * Starting at the source directory, find all the ts files and convert them into the distribution directory.
 * @function
 * @memberOf module:js-build-tools
 * @returns {*}
 */
const typeScript = () => tsProject
  .src()
  .pipe(tsProject())
  .js
  .pipe(dest(gulpConfig.get('distPath')))

module.exports = typeScript

/**
 * @see https://www.typescriptlang.org/docs/handbook/gulp.html add ts plugin
 */