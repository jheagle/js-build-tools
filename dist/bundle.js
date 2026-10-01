'use strict'

require('core-js/modules/esnext.weak-map.delete-all.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.bundle = void 0
require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.map.js')
const _browserify = _interopRequireDefault(require('browserify'))
const _gulp = require('gulp')
const _mergeStream = _interopRequireDefault(require('merge-stream'))
const gulpConfig = _interopRequireWildcard(require('../gulp.config.js'))
const _vinylSourceStream = _interopRequireDefault(require('vinyl-source-stream'))
const _getBundleConfigs = require('./utilities/getBundleConfigs.js')
function _interopRequireWildcard (e, t) { if (typeof WeakMap === 'function') var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; let o; let i; const f = { __proto__: null, default: e }; if (e === null || typeof e !== 'object' && typeof e !== 'function') return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f) } for (const t in e) t !== 'default' && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f })(e, t) }
function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
/**
 * Starting at each bundle's own entry point (dist.main for the primary bundle, or its own
 * override from browser.bundles), bundle all the reachable files into a single file per bundle and
 * store them in the specified output directory. A project with no browser.bundles entries gets
 * exactly the one bundle it always did; each additional entry produces its own separate bundle
 * (for example, a render-only variant built from a different entry point than the full bundle).
 *
 * A bundle's name does double duty: it names the output file (name.js) and, via browserify's
 * `standalone` option, is also the name its exports are exposed under - as a global when loaded
 * with a bare <script> tag, or as the module when required via CommonJS/AMD. Without this, a
 * bundle built from a real entry point (one that actually exports something) builds successfully
 * but exposes nothing a consumer can reach.
 *
 * Two escape hatches from browser.config.json keep an unwanted dependency (or a dependency's dependency) out of the
 * bundle: 'ignore' replaces it with an empty object (safe when your code never actually calls into it - for example
 * a library's default option value you always override with your own) and 'exclude' leaves it out entirely (your
 * code must not require it, or provide it another way, such as a separate script tag).
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
const bundle = () => (0, _mergeStream.default)((0, _getBundleConfigs.getBundleConfigs)().map(({
  name,
  main,
  ignore,
  exclude
}) => {
  const bundler = (0, _browserify.default)(main, {
    standalone: name
  })
  if (ignore && ignore.length) {
    bundler.ignore(ignore)
  }
  if (exclude && exclude.length) {
    bundler.exclude(exclude)
  }
  return bundler.bundle().pipe((0, _vinylSourceStream.default)(`${name}.js`))
})
// One shared dest() for every bundle, not one per bundle - vinyl-fs's dest() races against
// itself (a real "write after end" failure) when two separate dest() streams target the same
// directory concurrently, which every additional bundle's own dest() call otherwise would.
).pipe((0, _gulp.dest)(gulpConfig.get('browser.to')))
exports.bundle = bundle
