"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.distFor = void 0;
var _gulpBabel = _interopRequireDefault(require("gulp-babel"));
var _gulp = require("gulp");
var _distForSrc = require("./distForSrc.js");
var gulpConfig = _interopRequireWildcard(require("../../gulp.config.js"));
var _through = _interopRequireDefault(require("through2"));
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Build the distribution for a given source pattern.
 * @memberOf module:partials
 * @param {string|array} [srcPath='src/config/path/dist/for']
 * @param {string} [destPath='dist/config/path']
 * @returns {stream.Stream}
 */
const distFor = (srcPath = (0, _distForSrc.distForSrc)(), destPath = gulpConfig.get('dist.to')) => (0, _gulp.src)(srcPath).pipe((0, _gulpBabel.default)()).pipe(_through.default.obj(function (file, enc, callback) {
  const regex = /\.mjs(['"]\s*\))/gi;
  file.contents = Buffer.from(file.contents.toString().replaceAll(regex, '.js$1'));
  this.push(file);
  callback();
})).pipe((0, _gulp.dest)(destPath));
exports.distFor = distFor;