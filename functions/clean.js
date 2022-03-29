const del = require('del')
const gulpConfig = require('../gulp.config.js')

/**
 * Deletes all the distribution and browser files (used before create a new build).
 * @returns {Promise<string[]> | *}
 */
const clean = () => del([gulpConfig.distPath, gulpConfig.browserPath])

module.exports = clean
