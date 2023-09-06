'use strict'

var tsFor = require('./partials/tsFor')

/**
 * Simplified typescript task using tsFor.
 * @function
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
var typeScript = function typeScript () {
  return tsFor()
}
module.exports = typeScript
