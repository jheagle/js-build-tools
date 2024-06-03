import { dist } from './dist.mjs'
import { bundle } from './bundle.mjs'
import * as gulpConfig from '../gulp.config.mjs'
import { series } from 'gulp'

/**
 * Recommended as the default task, runs the simple dist and bundle tasks.
 * @memberOf module:js-build-tools
 * @param {function} [done=null]
 * @returns {stream.Stream}
 */
export const defaultCmd = (done = null) => gulpConfig.get('browser.enabled') ? series(dist, bundle)(done) : series(dist)(done)
