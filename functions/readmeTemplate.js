const { dest, src } = require('gulp')
const gulpConfig = require('../gulp.config.js')
const rename = require('gulp-rename')

/**
 * Copy a readme template into the README.md file.
 * @returns {*}
 */
const readmeTemplate = () => src(gulpConfig.readmeTemplate)
  .pipe(rename('README.md'))
  .pipe(dest('.'))

module.exports = readmeTemplate
