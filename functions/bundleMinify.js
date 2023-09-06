const gulpConfig = require('../gulp.config.js')
const minifyFor = require('./partials/minifyFor')

/**
 * Creates the minified bundle file.
 * @function
 * @memberOf module:js-build-tools
 * @returns {*}
 */
const bundleMinify = () => minifyFor(`${gulpConfig.get('browserPath')}/${gulpConfig.get('browserName')}.js`, gulpConfig.get('browserPath'))

module.exports = bundleMinify
