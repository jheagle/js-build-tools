const babel = require('gulp-babel')
const { dest, src } = require('gulp')
const gulpConfig = require('../gulp.config.js')

const distFor = (srcPath = gulpConfig.srcSearch, destPath = gulpConfig.distPath) => src(srcPath)
  .pipe(babel())
  .pipe(dest(destPath))

module.exports = distFor
