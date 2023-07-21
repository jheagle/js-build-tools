const gulpConfig = require('../gulp.config.js')
const minifyFor = require('./minifyFor')

/**
 * Creates the minified bundle file.
 * @returns {*}
 */
const bundleMinify = () => minifyFor(`${gulpConfig.get('browserPath')}/${gulpConfig.get('browserName')}.js`, gulpConfig.get('browserPath'))

module.exports = bundleMinify
