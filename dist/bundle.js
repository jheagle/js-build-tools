'use strict'

require('core-js/modules/esnext.weak-map.delete-all.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.bundle = void 0
const _browserify = _interopRequireDefault(require('browserify'))
const _gulp = require('gulp')
const gulpConfig = _interopRequireWildcard(require('../gulp.config.js'))
const _vinylSourceStream = _interopRequireDefault(require('vinyl-source-stream'))
function _interopRequireWildcard (e, t) { if (typeof WeakMap === 'function') var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; let o; let i; const f = { __proto__: null, default: e }; if (e === null || typeof e !== 'object' && typeof e !== 'function') return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f) } for (const t in e) t !== 'default' && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f })(e, t) }
function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
/**
 * Starting at the distribution entry point, bundle all the files into a single file and store them in the specified output directory.
 *
 * Two escape hatches from browser.config.json keep an unwanted dependency (or a dependency's dependency) out of the
 * bundle: 'ignore' replaces it with an empty object (safe when your code never actually calls into it - for example
 * a library's default option value you always override with your own) and 'exclude' leaves it out entirely (your
 * code must not require it, or provide it another way, such as a separate script tag).
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
const bundle = () => {
  const bundler = (0, _browserify.default)(gulpConfig.get('dist.main'))
  const ignore = gulpConfig.get('browser.ignore')
  const exclude = gulpConfig.get('browser.exclude')
  if (ignore && ignore.length) {
    bundler.ignore(ignore)
  }
  if (exclude && exclude.length) {
    bundler.exclude(exclude)
  }
  return bundler.bundle().pipe((0, _vinylSourceStream.default)(`${gulpConfig.get('browser.name')}.js`)).pipe((0, _gulp.dest)(gulpConfig.get('browser.to')))
}
exports.bundle = bundle
