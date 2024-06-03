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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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