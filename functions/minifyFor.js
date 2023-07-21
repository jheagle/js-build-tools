const { dest, src } = require('gulp')
const { default: uglify } = require('gulp-uglify-es')
const rename = require('gulp-rename')

/**
 * Minify files and rename the output with '.min' extension.
 * @returns {*}
 */
const minifyFor = (srcSearch, destination) => src(srcSearch)
  .pipe(uglify())
  .pipe(rename({ extname: '.min.js' }))
  .pipe(dest(destination))

module.exports = minifyFor
