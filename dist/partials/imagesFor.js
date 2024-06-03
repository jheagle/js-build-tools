"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.imagesFor = void 0;
var _gulpCache = _interopRequireDefault(require("gulp-cache"));
var _gulp = require("gulp");
var gulpConfig = _interopRequireWildcard(require("../../gulp.config.js"));
var _gulpImagemin = _interopRequireDefault(require("gulp-imagemin"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Move and optimize images into the browser directory.
 * @memberOf module:partials
 * @param {string|array} [imageSrc=src/images/pattern]
 * @param {string} [imageDest=dest/image/folder]
 * @return {stream.Stream}
 */
const imagesFor = function () {
  let imageSrc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : gulpConfig.get('images.from');
  let imageDest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : gulpConfig.get('images.to');
  return (0, _gulp.src)(imageSrc).pipe(
  // Caching images that ran through imagemin
  (0, _gulpCache.default)((0, _gulpImagemin.default)({
    interlaced: true,
    silent: true,
    verbose: false
  }))).pipe((0, _gulp.dest)(imageDest));
};
exports.imagesFor = imagesFor;