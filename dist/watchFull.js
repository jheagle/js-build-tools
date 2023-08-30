'use strict'

const {
  beginWatcher,
  runOnChange
} = require('./partials')

/**
 * Watch for changes and run the distribution for the changed files, then bundle and test the changed files.
 * @function
 * @memberOf module:js-build-tools
 * @returns {FSWatcher}
 */
const watchFull = () => beginWatcher().on('change', runOnChange)
module.exports = watchFull
