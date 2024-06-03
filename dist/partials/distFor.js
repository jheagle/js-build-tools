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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Build the distribution for a given source pattern.
 * @memberOf module:partials
 * @param {string|array} [srcPath='src/config/path/dist/for']
 * @param {string} [destPath='dist/config/path']
 * @returns {stream.Stream}
 */
const distFor = function () {
  let srcPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _distForSrc.distForSrc)();
  let destPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : gulpConfig.get('dist.to');
  return (0, _gulp.src)(srcPath).pipe((0, _gulpBabel.default)()).pipe(_through.default.obj(function (file, enc, callback) {
    const regex = /\.mjs(['"]\s*\))/gi;
    file.contents = Buffer.from(file.contents.toString().replaceAll(regex, '.js$1'));
    this.push(file);
    callback();
  })).pipe((0, _gulp.dest)(destPath));
};
exports.distFor = distFor;