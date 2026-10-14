"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.distMinify = void 0;
var gulpConfig = _interopRequireWildcard(require("../gulp.config.js"));
var _minifyFor = require("./partials/minifyFor.js");
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
/**
 * Creates minified versions of the dist files.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
const distMinify = () => (0, _minifyFor.minifyFor)(gulpConfig.get('browser.from'), gulpConfig.get('dist.to'));
exports.distMinify = distMinify;