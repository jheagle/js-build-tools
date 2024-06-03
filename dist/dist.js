'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.dist = void 0
var _distFor = require('./partials/distFor.js')
/**
 * Simplified distribution tasks which will use arguments from distFor.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
const dist = () => (0, _distFor.distFor)()
exports.dist = dist
