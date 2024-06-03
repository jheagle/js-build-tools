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
function _getRequireWildcardCache (e) { if (typeof WeakMap !== 'function') return null; var r = new WeakMap(); var t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r })(e) }
function _interopRequireWildcard (e, r) { if (!r && e && e.__esModule) return e; if (e === null || typeof e !== 'object' && typeof e !== 'function') return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }; var a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if (u !== 'default' && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u] } return n.default = e, t && t.set(e, n), n }
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
