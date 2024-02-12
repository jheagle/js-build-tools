'use strict'

const gulpConfig = require('../gulp.config.js')
const minifyFor = require('./partials/minifyFor')

/**
 * Creates the minified bundle file.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
const bundleMinify = () => minifyFor(''.concat(gulpConfig.get('browser.to'), '/').concat(gulpConfig.get('browser.name'), '.js'), gulpConfig.get('browser.to'))
module.exports = bundleMinify
