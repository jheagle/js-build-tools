'use strict'

const tsFor = require('./partials/tsFor')

/**
 * Simplified typescript task using tsFor.
 * @function
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
const typeScript = () => tsFor()
module.exports = typeScript
