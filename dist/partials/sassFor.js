"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sassFor = void 0;
var _gulp = require("gulp");
var gulpConfig = _interopRequireWildcard(require("../../gulp.config.js"));
var _autoprefixer = _interopRequireDefault(require("autoprefixer"));
var _cssnano = _interopRequireDefault(require("cssnano"));
var _gulpPostcss = _interopRequireDefault(require("gulp-postcss"));
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
const sassFor = (srcSearch = gulpConfig.get('sass.from'), cssPath = gulpConfig.get('sass.to')) => (0, _gulp.src)(srcSearch).pipe(runSass().on('error', runSass.logError)) // Passes it through a gulp-sass, log errors to console
.pipe((0, _gulp.dest)(cssPath))
// add: false - the old gulp-cssnano only ever removed obsolete vendor prefixes, never added any; keep that.
.pipe((0, _gulpPostcss.default)([(0, _autoprefixer.default)({
  add: false
}), (0, _cssnano.default)()])).pipe((0, _gulpRename.default)({
  extname: '.min.css'
})).pipe((0, _gulp.dest)(cssPath));
exports.sassFor = sassFor;