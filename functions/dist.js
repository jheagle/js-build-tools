const distFor = require('./partials/distFor.js')

/**
 * Simplified distribution tasks which will use arguments from distFor.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
const dist = () => distFor()

module.exports = dist
