"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyFonts = void 0;
var _copyFor = require("./partials/copyFor.js");
var gulpConfig = _interopRequireWildcard(require("../gulp.config.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * Move the font files into the browser directory.
 * @memberOf module:js-build-tools
 * @return {stream.Stream}
 */
const copyFonts = () => (0, _copyFor.copyFor)(gulpConfig.get('fonts.from'), gulpConfig.get('fonts.to'));
exports.copyFonts = copyFonts;