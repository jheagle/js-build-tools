'use strict'

const copyFor = require('./partials/copyFor.js')
const gulpConfig = require('../gulp.config.js')

/**
 * Move the font files into the browser directory.
 * @memberOf module:js-build-tools
 * @return {stream.Stream}
 */
const copyFonts = () => copyFor(gulpConfig.get('fontSearch'), gulpConfig.get('fontDest'))
module.exports = copyFonts
