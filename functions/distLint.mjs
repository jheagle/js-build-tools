import * as gulpConfig from '../gulp.config.mjs'
import { dest, src } from 'gulp'
import { standardLint } from './partials/standardLint.mjs'

/**
 * Applies Standard code style linting to distribution files.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
export const distLint = () => src(gulpConfig.get('browser.from'))
  .pipe(standardLint({ fix: true }))
  .pipe(dest(gulpConfig.get('dist.to')))
