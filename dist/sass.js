'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.sass = void 0
var _sassFor = require('./partials/sassFor.js')
// Compile sass into CSS & auto-inject into browsers
const sass = () => (0, _sassFor.sassFor)()
exports.sass = sass
