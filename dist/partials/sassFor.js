"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sassFor = void 0;
var _gulp = require("gulp");
var gulpConfig = _interopRequireWildcard(require("../../gulp.config.js"));
var _gulpCssnano = _interopRequireDefault(require("gulp-cssnano"));
var _gulpRename = _interopRequireDefault(require("gulp-rename"));
var sass = _interopRequireWildcard(require("sass"));
var _gulpSass = _interopRequireDefault(require("gulp-sass"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const runSass = (0, _gulpSass.default)(sass);

/**
 * Build the CSS for a given source pattern.
 * @memberOf module:partials
 * @param {string|array} [srcSearch='src/config/path/sass/for']
 * @param {string} [cssPath='css/config/path']
 * @returns {stream.Stream}
 */
const sassFor = function () {
  let srcSearch = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : gulpConfig.get('sass.from');
  let cssPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : gulpConfig.get('sass.to');
  return (0, _gulp.src)(srcSearch).pipe(runSass().on('error', runSass.logError)) // Passes it through a gulp-sass, log errors to console
  .pipe((0, _gulp.dest)(cssPath)).pipe((0, _gulpCssnano.default)()).pipe((0, _gulpRename.default)({
    extname: '.min.css'
  })).pipe((0, _gulp.dest)(cssPath));
};
exports.sassFor = sassFor;