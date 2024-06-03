import * as gulpConfig from '../gulp.config.mjs'
import { minifyFor } from './partials/minifyFor.mjs'

/**
 * Creates minified versions of the dist files.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
export const distMinify = () => minifyFor(gulpConfig.get('browser.from'), gulpConfig.get('dist.to'))
