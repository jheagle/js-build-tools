'use strict'

require('core-js/modules/esnext.weak-map.delete-all.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.distLint = void 0
var gulpConfig = _interopRequireWildcard(require('../gulp.config.js'))
var _gulp = require('gulp')
var _gulpStandard = _interopRequireDefault(require('gulp-standard'))
function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
function _interopRequireWildcard (e, t) { if (typeof WeakMap === 'function') var r = new WeakMap(); var n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o; var i; var f = { __proto__: null, default: e }; if (e === null || typeof e !== 'object' && typeof e !== 'function') return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f) } for (const t in e) t !== 'default' && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f })(e, t) }
/**
 * Applies Standard code style linting to distribution files.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
const distLint = () => (0, _gulp.src)(gulpConfig.get('browser.from')).pipe((0, _gulpStandard.default)({
  fix: true
})).pipe(_gulpStandard.default.reporter('default', {
  fix: true,
  quiet: true
})).pipe((0, _gulp.dest)(gulpConfig.get('dist.to')))
exports.distLint = distLint
