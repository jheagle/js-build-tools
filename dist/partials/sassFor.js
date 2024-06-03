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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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