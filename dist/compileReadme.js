'use strict'

const {
  addToReadme,
  readmeTemplate
} = require('./partials')
const {
  series
} = require('gulp')

/**
 * Generate the README.md file based off of the template, then append the generated documentation.
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
const compileReadme = series(readmeTemplate, addToReadme)
module.exports = compileReadme
