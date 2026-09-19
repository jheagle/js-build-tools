'use strict'

require('core-js/modules/esnext.weak-map.delete-all.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.bundleLint = void 0
const _gulp = require('gulp')
const gulpConfig = _interopRequireWildcard(require('../gulp.config.js'))
const _standardLint = require('./partials/standardLint.js')
function _interopRequireWildcard (e, t) { if (typeof WeakMap === 'function') var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; let o; let i; const f = { __proto__: null, default: e }; if (e === null || typeof e !== 'object' && typeof e !== 'function') return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f) } for (const t in e) t !== 'default' && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f })(e, t) }
/**
 * Applies Standard code style linting to bundled file.
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
const bundleLint = () => (0, _gulp.src)(`${gulpConfig.get('browser.to')}/${gulpConfig.get('browser.name')}.js`).pipe((0, _standardLint.standardLint)({
  fix: true
})).pipe((0, _gulp.dest)(gulpConfig.get('browser.to')))
exports.bundleLint = bundleLint
