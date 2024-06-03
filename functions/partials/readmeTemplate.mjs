import { dest, src } from 'gulp'
import * as gulpConfig from '../../gulp.config.mjs'
import rename from 'gulp-rename'

/**
 * Copy a readme template into the README.md file.
 * @memberOf module:partials
 * @returns {*}
 */
export const readmeTemplate = () => src(gulpConfig.get('readme.template'))
  .pipe(rename(gulpConfig.get('readme.file')))
  .pipe(dest(gulpConfig.get('readme.to')))
