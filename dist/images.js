'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.images = void 0
var _imagesFor = require('./partials/imagesFor.js')
/**
 * Move and optimize the images into the browser folder using configured settings.
 * @memberOf module:js-build-tools
 * @return {stream.Stream}
 */
const images = () => (0, _imagesFor.imagesFor)()
exports.images = images
