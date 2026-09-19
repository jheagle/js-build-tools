import { dest, src } from 'gulp'
import * as gulpConfig from '../gulp.config.mjs'
import { standardLint } from './partials/standardLint.mjs'

/**
 * Applies Standard code style linting to bundled file.
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
export const bundleLint = () => src(`${gulpConfig.get('browser.to')}/${gulpConfig.get('browser.name')}.js`)
  .pipe(standardLint({ fix: true }))
  .pipe(dest(gulpConfig.get('browser.to')))
