import * as gulpConfig from '../gulp.config.mjs'
import { minifyFor } from './partials/minifyFor.mjs'

/**
 * Creates the minified bundle file.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
export const bundleMinify = () => minifyFor(`${gulpConfig.get('browser.to')}/${gulpConfig.get('browser.name')}.js`, gulpConfig.get('browser.to'))
