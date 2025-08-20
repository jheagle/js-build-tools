"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.distForSrc = void 0;
var gulpConfig = _interopRequireWildcard(require("../../gulp.config.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * Retrieve the correct distFor search path based on TS Config.
 * @memberOf module:partials
 * @param {module:gulpConfig~FlagStringSetting} [useTs='config/for/ts']
 * @returns {string}
 */
const distForSrc = function () {
  let useTs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : gulpConfig.get('typescript.enabled');
  return useTs ? gulpConfig.get('browser.from') : gulpConfig.get('dist.from');
};
exports.distForSrc = distForSrc;