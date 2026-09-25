"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadImagemin = exports.imagesFor = void 0;
var _gulpCache = _interopRequireDefault(require("gulp-cache"));
var _loadPeer = require("./loadPeer.js");
var _gulp = require("gulp");
var _nodePath = _interopRequireDefault(require("node:path"));
var gulpConfig = _interopRequireWildcard(require("../../gulp.config.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const installHint = 'Add it to your project with: npm install --save-dev github:jheagle/gulp-imagemin#common-js-compatibility ' + '(the CommonJS-compatible fork - upstream gulp-imagemin is ESM-only and cannot be require()d by this package\'s CommonJS build).';

/**
 * Load `gulp-imagemin`, an optional peer dependency: image optimization is off by default and its binary-download
 * dependency chain is heavy, so it is only required once the images task actually runs, and it is resolved from the
 * consuming project's own directory rather than from this package.
 * @memberOf module:partials
 * @param {string} [projectPath=process.cwd()] - The project directory to resolve `gulp-imagemin` from.
 * @returns {Function} The gulp-imagemin plugin factory.
 * @throws {Error} With install instructions when gulp-imagemin is missing or is the ESM-only upstream release.
 */
const loadImagemin = (projectPath = process.cwd()) => {
  const loaded = (0, _loadPeer.requirePeer)('gulp-imagemin', {
    task: 'images',
    installHint,
    esmOnlyMessage: `gulp-imagemin could not be loaded because it is ESM-only. ${installHint}`,
    projectPath
  });
  return loaded && (loaded.__esModule || loaded.default) ? loaded.default : loaded;
};

/**
 * Move and optimize images into the browser directory.
 * @memberOf module:partials
 * @param {string|array} [imageSrc=src/images/pattern]
 * @param {string} [imageDest=dest/image/folder]
 * @return {stream.Stream}
 */
exports.loadImagemin = loadImagemin;
const imagesFor = (imageSrc = gulpConfig.get('images.from'), imageDest = gulpConfig.get('images.to')) => {
  const imagemin = loadImagemin();
  // Gulp 5 reads files as utf8 text unless told otherwise, which corrupts binary images (and makes gulp-cache drop them).
  return (0, _gulp.src)(imageSrc, {
    encoding: false
  }).pipe(
  // Caching images that ran through imagemin
  (0, _gulpCache.default)(imagemin({
    interlaced: true,
    silent: true,
    verbose: false
  }))).pipe((0, _gulp.dest)(imageDest));
};
exports.imagesFor = imagesFor;