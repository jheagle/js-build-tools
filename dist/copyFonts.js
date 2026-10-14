"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyFonts = void 0;
var _copyFor = require("./partials/copyFor.js");
var gulpConfig = _interopRequireWildcard(require("../gulp.config.js"));
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
/**
 * Move the font files into the browser directory.
 * @memberOf module:js-build-tools
 * @return {stream.Stream}
 */
const copyFonts = () => (0, _copyFor.copyFor)(gulpConfig.get('fonts.from'), gulpConfig.get('fonts.to'));
exports.copyFonts = copyFonts;