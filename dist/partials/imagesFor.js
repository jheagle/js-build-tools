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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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