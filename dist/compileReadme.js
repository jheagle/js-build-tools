'use strict'

var _require = require('./partials')
var addToReadme = _require.addToReadme
var readmeTemplate = _require.readmeTemplate
var _require2 = require('gulp')
var series = _require2.series

/**
 * Generate the README.md file based off of the template, then append the generated documentation.
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
var compileReadme = series(readmeTemplate, addToReadme)
module.exports = compileReadme
