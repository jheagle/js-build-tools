'use strict'

var distFor = require('./partials/distFor.js')

/**
 * Simplified distribution tasks which will use arguments from distFor.
 * @function
 * @memberOf module:js-build-tools
 * @returns {*}
 */
var dist = function dist () {
  return distFor()
}
module.exports = dist
