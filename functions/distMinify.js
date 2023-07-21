const gulpConfig = require('../gulp.config.js')
const minifyFor = require('./minifyFor')

/**
 * Creates minified versions of the dist files.
 * @returns {*}
 */
const distMinify = () => minifyFor(gulpConfig.get('distSearch'), gulpConfig.get('distPath'))

module.exports = distMinify
