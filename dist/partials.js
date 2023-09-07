'use strict'

/**
 * Micro-functions used as components for the main gulp functions.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 2.0.0
 * @module partials
 * @memberOf module:js-build-tools
 */

var addToReadme = require('./partials/addToReadme')
var beginWatcher = require('./partials/beginWatcher')
var clean = require('./partials/clean')
var distFor = require('./partials/distFor')
var distForSrc = require('./partials/distForSrc')
var distSeries = require('./partials/distSeries')
var minifyFor = require('./partials/minifyFor')
var readmeTemplate = require('./partials/readmeTemplate')
var removeDirectory = require('./partials/removeDirectory')
var runOnChange = require('./partials/runOnChange')
var tsFor = require('./partials/tsFor')
module.exports = {
  addToReadme: addToReadme,
  beginWatcher: beginWatcher,
  clean: clean,
  distFor: distFor,
  distForSrc: distForSrc,
  distSeries: distSeries,
  minifyFor: minifyFor,
  readmeTemplate: readmeTemplate,
  removeDirectory: removeDirectory,
  runOnChange: runOnChange,
  tsFor: tsFor
}
