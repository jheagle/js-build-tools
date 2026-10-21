import { dest, src } from 'gulp'
import { default as gulpUglify } from 'gulp-uglify-es'
import rename from 'gulp-rename'

const uglify = Object.hasOwn(gulpUglify, 'default') ? gulpUglify.default : gulpUglify

/**
 * Minify files and rename the output with '.min' extension.
 * @memberOf module:partials
 * @returns {*}
 */
export const minifyFor = (srcSearch, destination) => src(srcSearch)
  .pipe(uglify())
  .pipe(rename({ extname: '.min.js' }))
  .pipe(dest(destination))
