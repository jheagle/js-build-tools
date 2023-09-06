const gulpConfig = require('../gulp.config.js')
const minifyFor = require('./partials/minifyFor')

/**
 * Creates minified versions of the dist files.
 * @function
 * @memberOf module:js-build-tools
 * @returns {*}
 */
const distMinify = () => minifyFor(gulpConfig.get('distSearch'), gulpConfig.get('distPath'))

module.exports = distMinify
