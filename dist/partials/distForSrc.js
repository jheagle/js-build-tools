"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.distForSrc = void 0;
var gulpConfig = _interopRequireWildcard(require("../../gulp.config.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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