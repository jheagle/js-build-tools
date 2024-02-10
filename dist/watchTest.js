'use strict'

const gulpConfig = require('../gulp.config.js')
const {
  watch
} = require('gulp')
const testQuick = require('./testQuick')

/**
 * Watch for changes and run the tests.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
const watchTest = () => watch(gulpConfig.get('test.watch'), {
  ignoreInitial: false
}, testQuick)
module.exports = watchTest
