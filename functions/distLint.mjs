import * as gulpConfig from '../gulp.config.mjs'
import { dest, src } from 'gulp'
import standard from 'gulp-standard'

/**
 * Applies Standard code style linting to distribution files.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
export const distLint = () => src(gulpConfig.get('browser.from'))
  .pipe(standard({ fix: true }))
  .pipe(standard.reporter('default', {
    fix: true,
    quiet: true
  }))
  .pipe(dest(gulpConfig.get('dist.to')))
