'use strict'

var _require = require('gulp')
var series = _require.series

var dist = require('./dist')

var bundle = require('./bundle')

var gulpConfig = require('../gulp.config')
/**
 * Recommended as the default task, runs the simple dist and bundle tasks.
 */

var defaultCmd = gulpConfig.nodeOnly ? series(dist) : series(dist, bundle)
module.exports = defaultCmd