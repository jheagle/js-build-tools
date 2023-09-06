const dist = require('./dist')
const bundle = require('./bundle')
const gulpConfig = require('../gulp.config')
const { series } = require('gulp')

/**
 * Recommended as the default task, runs the simple dist and bundle tasks.
 * @memberOf module:js-build-tools
 * @param {function} [done=null]
 * @returns {stream.Stream}
 */
const defaultCmd = (done = null) => gulpConfig.get('nodeOnly') ? series(dist)(done) : series(dist, bundle)(done)

module.exports = defaultCmd
