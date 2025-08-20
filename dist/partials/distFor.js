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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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