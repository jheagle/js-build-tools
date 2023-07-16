'use strict'

var addToReadme = require('./addToReadme')
var readmeTemplate = require('./readmeTemplate')
var _require = require('gulp')
var series = _require.series

/**
 * Generate the README.md file based off of the template, then append the generated documentation.
 */
var compileReadme = series(readmeTemplate, addToReadme)
module.exports = compileReadme
