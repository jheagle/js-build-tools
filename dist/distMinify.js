'use strict'

require('core-js/modules/esnext.weak-map.delete-all.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.distMinify = void 0
var gulpConfig = _interopRequireWildcard(require('../gulp.config.js'))
var _minifyFor = require('./partials/minifyFor.js')
function _interopRequireWildcard (e, t) { if (typeof WeakMap === 'function') var r = new WeakMap(); var n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o; var i; var f = { __proto__: null, default: e }; if (e === null || typeof e !== 'object' && typeof e !== 'function') return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f) } for (const t in e) t !== 'default' && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f })(e, t) }
/**
 * Creates minified versions of the dist files.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
const distMinify = () => (0, _minifyFor.minifyFor)(gulpConfig.get('browser.from'), gulpConfig.get('dist.to'))
exports.distMinify = distMinify
