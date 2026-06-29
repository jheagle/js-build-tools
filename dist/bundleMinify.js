'use strict'

require('core-js/modules/esnext.weak-map.delete-all.js')
require('core-js/modules/web.dom-collections.iterator.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.bundleMinify = void 0
var gulpConfig = _interopRequireWildcard(require('../gulp.config.js'))
var _minifyFor = require('./partials/minifyFor.js')
function _interopRequireWildcard (e, t) { if (typeof WeakMap === 'function') var r = new WeakMap(); var n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o; var i; var f = { __proto__: null, default: e }; if (e === null || typeof e !== 'object' && typeof e !== 'function') return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f) } for (const t in e) t !== 'default' && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f })(e, t) }
/**
 * Creates the minified bundle file.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
const bundleMinify = () => (0, _minifyFor.minifyFor)(''.concat(gulpConfig.get('browser.to'), '/').concat(gulpConfig.get('browser.name'), '.js'), gulpConfig.get('browser.to'))
exports.bundleMinify = bundleMinify
