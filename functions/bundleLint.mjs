import { dest, src } from 'gulp'
import * as gulpConfig from '../gulp.config.mjs'
import standard from 'gulp-standard'

/**
 * Applies Standard code style linting to bundled file.
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
export const bundleLint = () => src(`${gulpConfig.get('browser.to')}/${gulpConfig.get('browser.name')}.js`)
  .pipe(standard({ fix: true }))
  .pipe(standard.reporter('default', {
    fix: true,
    quiet: true
  }))
  .pipe(dest(gulpConfig.get('browser.to')))
