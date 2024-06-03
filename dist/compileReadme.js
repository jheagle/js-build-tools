'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.compileReadme = void 0
var _partials = require('./partials.js')
var _gulp = require('gulp')
/**
 * Generate the README.md file based off of the template, then append the generated documentation.
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
const compileReadme = exports.compileReadme = (0, _gulp.series)(_partials.readmeTemplate, _partials.addToReadme)
