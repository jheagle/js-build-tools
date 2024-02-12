const copyFor = require('./partials/copyFor.js')
const gulpConfig = require('../gulp.config.js')

/**
 * Move the font files into the browser directory.
 * @memberOf module:js-build-tools
 * @return {stream.Stream}
 */
const copyFonts = () => copyFor(gulpConfig.get('fonts.from'), gulpConfig.get('fonts.to'))

module.exports = copyFonts
