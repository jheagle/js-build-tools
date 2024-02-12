const gulpConfig = require('../gulp.config.js')
const minifyFor = require('./partials/minifyFor')

/**
 * Creates the minified bundle file.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
const bundleMinify = () => minifyFor(`${gulpConfig.get('browser.to')}/${gulpConfig.get('browser.name')}.js`, gulpConfig.get('browser.to'))

module.exports = bundleMinify
