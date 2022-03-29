const { series } = require('gulp')
const dist = require('./dist')
const bundle = require('./bundle')

/**
 * Recommended as the default task, runs the simple dist and bundle tasks.
 */
const defaultCmd = series(dist, bundle)

module.exports = defaultCmd
