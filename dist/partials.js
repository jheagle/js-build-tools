'use strict'

/**
 * Micro-functions used as components for the main gulp functions.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 2.0.0
 * @module partials
 * @memberOf module:js-build-tools
 */

const addToReadme = require('./partials/addToReadme')
const beginWatcher = require('./partials/beginWatcher')
const clean = require('./partials/clean')
const distFor = require('./partials/distFor')
const distForSrc = require('./partials/distForSrc')
const distSeries = require('./partials/distSeries')
const minifyFor = require('./partials/minifyFor')
const readmeTemplate = require('./partials/readmeTemplate')
const removeDirectory = require('./partials/removeDirectory')
const runOnChange = require('./partials/runOnChange')
const sassFor = require('./partials/sassFor')
const tsFor = require('./partials/tsFor')
module.exports = {
  addToReadme,
  beginWatcher,
  clean,
  distFor,
  distForSrc,
  distSeries,
  minifyFor,
  readmeTemplate,
  removeDirectory,
  runOnChange,
  sassFor,
  tsFor
}
