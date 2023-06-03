'use strict'

const {
  series
} = require('gulp')
const dist = require('./dist')
const bundle = require('./bundle')
const gulpConfig = require('../gulp.config')

/**
 * Recommended as the default task, runs the simple dist and bundle tasks.
 */
const defaultCmd = gulpConfig.nodeOnly ? series(dist) : series(dist, bundle)
module.exports = defaultCmd
