"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.distSeries = void 0;
var gulpConfig = _interopRequireWildcard(require("../../gulp.config.js"));
var _distFor = require("./distFor.js");
var _distForSrc = require("./distForSrc.js");
var _gulp = require("gulp");
var _tsFor = require("./tsFor.js");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * When using TypeScript, ensure that we process the ts first then run babel (dist)
 * @memberOf module:partials
 * @param {string} [srcPath='src/config/path/dist/for']
 * @param {string} [distFinalPath='dist/config/path']
 * @param {string} [tsSearch='ts/search/config/path']
 * @returns {function(null=): stream.Stream}
 */
const distSeries = function () {
  let srcPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _distForSrc.distForSrc)();
  let distFinalPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : gulpConfig.get('dist.to');
  let tsSearch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : gulpConfig.get('typescript.from');
  const typescript = (0, _tsFor.tsFor)(tsSearch, distFinalPath);
  const dist = () => (0, _distFor.distFor)(srcPath, distFinalPath);
  return gulpConfig.get('typescript.enabled') ? (0, _gulp.series)(typescript, dist) : dist;
};
exports.distSeries = distSeries;