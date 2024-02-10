'use strict'

/**
 * Micro-functions used as components for the main gulp functions.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 3.0.0
 * @module partials
 * @memberOf module:js-build-tools
 */

const addToReadme = require('./partials/addToReadme')
const beginWatcher = require('./partials/beginWatcher')
const clean = require('./partials/clean')
const copyFor = require('./partials/copyFor')
const distFor = require('./partials/distFor')
const distForSrc = require('./partials/distForSrc')
const distSeries = require('./partials/distSeries')
const imagesFor = require('./partials/imagesFor.js')
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
  copyFor,
  distFor,
  distForSrc,
  distSeries,
  imagesFor,
  minifyFor,
  readmeTemplate,
  removeDirectory,
  runOnChange,
  sassFor,
  tsFor
}
