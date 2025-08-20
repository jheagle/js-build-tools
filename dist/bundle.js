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
function _interopRequireWildcard (e, t) { if (typeof WeakMap === 'function') var r = new WeakMap(); var n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o; var i; var f = { __proto__: null, default: e }; if (e === null || typeof e !== 'object' && typeof e !== 'function') return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f) } for (const t in e) t !== 'default' && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f })(e, t) }
function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
/**
 * Starting at the distribution entry point, bundle all the files into a single file and store them in the specified output directory.
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
const bundle = () => (0, _browserify.default)(gulpConfig.get('dist.main')).bundle().pipe((0, _vinylSourceStream.default)(`${gulpConfig.get('browser.name')}.js`)).pipe((0, _gulp.dest)(gulpConfig.get('browser.to')))
exports.bundle = bundle
