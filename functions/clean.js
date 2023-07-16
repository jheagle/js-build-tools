const del = require('del')
const gulpConfig = require('../gulp.config.js')

/**
 * Deletes all the distribution and browser files (used before create a new build).
 * @param {function} [done=null]
 * @param {string[]} [paths=[]]
 * @returns {Promise<string[]> | *}
 */
const clean = (done = null, paths = [gulpConfig.get('distPath'), gulpConfig.get('browserPath')]) => del(paths).then(() => done && done())

module.exports = clean
