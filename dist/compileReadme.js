'use strict'

const addToReadme = require('./addToReadme')
const readmeTemplate = require('./readmeTemplate')
const {
  series
} = require('gulp')

/**
 * Generate the README.md file based off of the template, then append the generated documentation.
 */
const compileReadme = series(readmeTemplate, addToReadme)
module.exports = compileReadme
