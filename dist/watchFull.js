'use strict'

require('core-js/modules/es.string.replace.js')
const bundle = require('./bundle')
const distFor = require('./distFor')
const gulpConfig = require('../gulp.config.js')
const {
  parallel,
  series,
  watch
} = require('gulp')
const testQuick = require('./testQuick')

/**
 * Watch for changes and run the distribution for the changed files, then bundle and test the changed files.
 * @returns {*}
 */
const watchFull = () => watch(gulpConfig.watchSearch).on('change', path => {
  const pathRegex = new RegExp('^'.concat(gulpConfig.srcPath, '(.*\\/).+\\.js$'), 'i')
  const distForPath = () => distFor(path, path.replace(pathRegex, ''.concat(gulpConfig.distPath, '$1')))
  return parallel(testQuick, series(distForPath, bundle))()
})
module.exports = watchFull
