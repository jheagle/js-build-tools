'use strict'

require('core-js/modules/esnext.weak-map.delete-all.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.bundleMinify = void 0
require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.map.js')
const gulpConfig = _interopRequireWildcard(require('../gulp.config.js'))
const _minifyFor = require('./partials/minifyFor.js')
const _getBundleConfigs = require('./utilities/getBundleConfigs.js')
function _interopRequireWildcard (e, t) { if (typeof WeakMap === 'function') var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; let o; let i; const f = { __proto__: null, default: e }; if (e === null || typeof e !== 'object' && typeof e !== 'function') return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f) } for (const t in e) t !== 'default' && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f })(e, t) }
/**
 * Creates the minified file for every bundle (the primary bundle, plus any additional ones from
 * browser.bundles). The minify step itself never varies per bundle, so this is one shared
 * src()/dest() pipeline (inside minifyFor) fed every bundle's filename at once, rather than one
 * pipeline per bundle - gulp's src() accepts an array of paths natively.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
const bundleMinify = () => (0, _minifyFor.minifyFor)((0, _getBundleConfigs.getBundleConfigs)().map(({
  name
}) => `${gulpConfig.get('browser.to')}/${name}.js`), gulpConfig.get('browser.to'))
exports.bundleMinify = bundleMinify
