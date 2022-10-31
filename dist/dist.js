'use strict'

var distFor = require('./distFor.js')

/**
 * Simplified distribution tasks which will use arguments from distFor.
 * @returns {*}
 */
var dist = function dist () {
  return distFor()
}
module.exports = dist
