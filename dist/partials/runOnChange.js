"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runOnChange = void 0;
var gulpConfig = _interopRequireWildcard(require("../../gulp.config.js"));
var _bundle = require("../bundle.js");
var _distSeries = require("./distSeries.js");
var _gulp = require("gulp");
var _testQuick = require("../testQuick.js");
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
/**
 * Run this function when the watched files are modified.
 * 1. Find the sub-folders within src path
 * 2. Maintain the folders, but use distPath for base
 * 3. Remove base folder and return dist path with correct sub-folders
 * @example
 * // Configured paths
 * distPath = 'dist'
 * srcPath = 'functions'
 *
 * // Path parameter
 * path = 'functions/some/path/file.js'
 *
 * // Generated regex using configured srcPath
 * pathRegex = '/^functions(.*\/).+\.js$/i'
 *
 * // Replace value using the configured distPath
 * replacePath = 'dist$1'
 *
 * // The resulting replaced path for the destination folder
 * distPathResult = 'dist/some/path/'
 * @memberOf module:partials
 * @param {string} path
 * @returns {stream.Stream}
 */
const runOnChange = path => {
  const useTs = gulpConfig.get('typescript.enabled');
  const distPath = gulpConfig.get('dist.to');
  const srcPath = gulpConfig.get('srcPath');
  /**
   * 1. The original path comes in from src and is a .ts
   * 2. Discover the outgoing dist path where that file should go
   * 3. Use the path and dist in tsFor
   * 4. Take the original path, convert to full file path in dist
   * 5. Use the dist path found previously in #2
   * 6. Use the full dist path and the dist outgoing path in distFor
   */
  const pathRegex = new RegExp(`^${srcPath}(.*\\/)(.+)\\.(js|ts)$`, 'i');
  const distPathResult = path.replace(pathRegex, `${distPath}$1`);
  let distSrcPath = path;
  if (useTs) {
    distSrcPath = path.replace(pathRegex, `${distPath}$1$2.js`);
  }
  const runSeries = (0, _distSeries.distSeries)(distSrcPath, distPathResult, path);
  return gulpConfig.get('browser.enabled') ? (0, _gulp.parallel)(_testQuick.testQuick, (0, _gulp.series)(runSeries, _bundle.bundle))() : (0, _gulp.series)(_testQuick.testQuick, runSeries)();
};
exports.runOnChange = runOnChange;