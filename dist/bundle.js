'use strict'

require('core-js/modules/esnext.weak-map.delete-all.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.bundle = void 0
var _browserify = _interopRequireDefault(require('browserify'))
var _gulp = require('gulp')
var gulpConfig = _interopRequireWildcard(require('../gulp.config.js'))
var _vinylSourceStream = _interopRequireDefault(require('vinyl-source-stream'))
function _getRequireWildcardCache (e) { if (typeof WeakMap !== 'function') return null; var r = new WeakMap(); var t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r })(e) }
function _interopRequireWildcard (e, r) { if (!r && e && e.__esModule) return e; if (e === null || typeof e !== 'object' && typeof e !== 'function') return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }; var a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if (u !== 'default' && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u] } return n.default = e, t && t.set(e, n), n }
function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
/**
 * Starting at the distribution entry point, bundle all the files into a single file and store them in the specified output directory.
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
const bundle = () => (0, _browserify.default)(gulpConfig.get('dist.main')).bundle().pipe((0, _vinylSourceStream.default)(`${gulpConfig.get('browser.name')}.js`)).pipe((0, _gulp.dest)(gulpConfig.get('browser.to')))
exports.bundle = bundle
