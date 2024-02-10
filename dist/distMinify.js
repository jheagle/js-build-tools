'use strict'

const gulpConfig = require('../gulp.config.js')
const minifyFor = require('./partials/minifyFor')

/**
 * Creates minified versions of the dist files.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
const distMinify = () => minifyFor(gulpConfig.get('browser.from'), gulpConfig.get('dist.to'))
module.exports = distMinify
