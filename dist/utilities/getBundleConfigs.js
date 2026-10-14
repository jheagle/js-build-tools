"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBundleConfigs = void 0;
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.map.js");
var gulpConfig = _interopRequireWildcard(require("../../gulp.config.js"));
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
/**
 * Build the full list of bundles to produce for this project: the primary bundle (browser.name /
 * dist.main / browser.ignore / browser.exclude, exactly as before browser.bundles existed) plus
 * any additional bundles from browser.bundles - each falling back to the primary's main / ignore /
 * exclude whenever its own isn't given, so a render-only (or any other variant) bundle only has to
 * specify what's actually different about it.
 * @memberOf module:utilities
 * @returns {Array<{name: string, main: string, ignore: Array, exclude: Array}>}
 */
const getBundleConfigs = () => {
  const primary = {
    name: gulpConfig.get('browser.name'),
    main: gulpConfig.get('dist.main'),
    ignore: gulpConfig.get('browser.ignore'),
    exclude: gulpConfig.get('browser.exclude')
  };
  const additional = gulpConfig.get('browser.bundles');
  return [primary, ...additional.map(bundleConfig => ({
    name: bundleConfig.name,
    main: bundleConfig.main || primary.main,
    ignore: bundleConfig.ignore || primary.ignore,
    exclude: bundleConfig.exclude || primary.exclude
  }))];
};
exports.getBundleConfigs = getBundleConfigs;