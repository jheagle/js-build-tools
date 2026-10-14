"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bundleMinify = void 0;
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.map.js");
var gulpConfig = _interopRequireWildcard(require("../gulp.config.js"));
var _minifyFor = require("./partials/minifyFor.js");
var _getBundleConfigs = require("./utilities/getBundleConfigs.js");
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
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
}) => `${gulpConfig.get('browser.to')}/${name}.js`), gulpConfig.get('browser.to'));
exports.bundleMinify = bundleMinify;