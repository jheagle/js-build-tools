const { dest, src } = require('gulp')
const gulpConfig = require('../../gulp.config.js')
const ts = require('gulp-typescript')

const tsProject = ts.createProject(gulpConfig.get('useTsConfig'))

/**
 * Starting at the source directory, find all the ts files and convert them into the distribution directory.
 * @function
 * @memberOf module:partials
 * @param {string|array} [srcPath='']
 * @param {string} [distPath='']
 * @returns {stream.Stream}
 * @see `https://www.typescriptlang.org/docs/handbook/gulp.html` for more info
 */
const tsFor = (srcPath = gulpConfig.get('tsSearch'), distPath = gulpConfig.get('distPath')) => src(srcPath)
  .pipe(tsProject())
  .js
  .pipe(dest(distPath))

module.exports = tsFor
