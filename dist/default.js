'use strict'

require('core-js/modules/esnext.weak-map.delete-all.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.defaultCmd = void 0
var _dist = require('./dist.js')
var _bundle = require('./bundle.js')
var gulpConfig = _interopRequireWildcard(require('../gulp.config.js'))
var _gulp = require('gulp')
function _interopRequireWildcard (e, t) { if (typeof WeakMap === 'function') var r = new WeakMap(); var n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o; var i; var f = { __proto__: null, default: e }; if (e === null || typeof e !== 'object' && typeof e !== 'function') return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f) } for (const t in e) t !== 'default' && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f })(e, t) }
/**
 * Recommended as the default task, runs the simple dist and bundle tasks.
 * @memberOf module:js-build-tools
 * @param {function} [done=null]
 * @returns {stream.Stream}
 */
const defaultCmd = function () {
  const done = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
  return gulpConfig.get('browser.enabled') ? (0, _gulp.series)(_dist.dist, _bundle.bundle)(done) : (0, _gulp.series)(_dist.dist)(done)
}
exports.defaultCmd = defaultCmd
