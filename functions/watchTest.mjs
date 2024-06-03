import * as gulpConfig from '../gulp.config.mjs'
import { watch } from 'gulp'
import { testQuick } from './testQuick.mjs'

/**
 * Watch for changes and run the tests.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
export const watchTest = () => watch(gulpConfig.get('test.watch'), { ignoreInitial: false }, testQuick)
