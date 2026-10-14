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
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
/**
 * When using TypeScript, ensure that we process the ts first then run babel (dist)
 * @memberOf module:partials
 * @param {string} [srcPath='src/config/path/dist/for']
 * @param {string} [distFinalPath='dist/config/path']
 * @param {string} [tsSearch='ts/search/config/path']
 * @returns {function(null=): stream.Stream}
 */
const distSeries = (srcPath = (0, _distForSrc.distForSrc)(), distFinalPath = gulpConfig.get('dist.to'), tsSearch = gulpConfig.get('typescript.from')) => {
  const typescript = (0, _tsFor.tsFor)(tsSearch, distFinalPath);
  const dist = () => (0, _distFor.distFor)(srcPath, distFinalPath);
  return gulpConfig.get('typescript.enabled') ? (0, _gulp.series)(typescript, dist) : dist;
};
exports.distSeries = distSeries;