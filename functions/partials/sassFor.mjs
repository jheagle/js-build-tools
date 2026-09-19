import { dest, src } from 'gulp'
import * as gulpConfig from '../../gulp.config.mjs'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import postcss from 'gulp-postcss'
import rename from 'gulp-rename'
import * as sass from 'sass'
import { default as gulpSass } from 'gulp-sass'

const runSass = gulpSass(sass)

/**
 * Build the CSS for a given source pattern.
 * @memberOf module:partials
 * @param {string|array} [srcSearch='src/config/path/sass/for']
 * @param {string} [cssPath='css/config/path']
 * @returns {stream.Stream}
 */
export const sassFor = (srcSearch = gulpConfig.get('sass.from'), cssPath = gulpConfig.get('sass.to')) => src(srcSearch)
  .pipe(runSass().on('error', runSass.logError)) // Passes it through a gulp-sass, log errors to console
  .pipe(dest(cssPath))
  // add: false - the old gulp-cssnano only ever removed obsolete vendor prefixes, never added any; keep that.
  .pipe(postcss([autoprefixer({ add: false }), cssnano()]))
  .pipe(rename({ extname: '.min.css' }))
  .pipe(dest(cssPath))
