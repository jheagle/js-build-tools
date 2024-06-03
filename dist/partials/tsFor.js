"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tsFor = void 0;
var _gulp = require("gulp");
var gulpConfig = _interopRequireWildcard(require("../../gulp.config.js"));
var _gulpTypescript = _interopRequireDefault(require("gulp-typescript"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Starting at the source directory, find all the ts files and convert them into the distribution directory.
 * @memberOf module:partials
 * @param {string|array} [srcPath='']
 * @param {string} [distPath='']
 * @returns {Function}
 * @see `https://www.typescriptlang.org/docs/handbook/gulp.html` for more info
 */
const tsFor = function () {
  let srcPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : gulpConfig.get('typescript.from');
  let distPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : gulpConfig.get('typescript.to');
  const declarationProject = _gulpTypescript.default.createProject(gulpConfig.get('typescript.config'));
  const tsProject = _gulpTypescript.default.createProject(gulpConfig.get('typescript.config'));
  const makeDeclarations = () => (0, _gulp.src)(srcPath).pipe(declarationProject()).dts.pipe((0, _gulp.dest)(distPath));
  const compileJS = () => (0, _gulp.src)(srcPath).pipe(tsProject()).js.pipe((0, _gulp.dest)(distPath));
  return (0, _gulp.parallel)(makeDeclarations, compileJS);
};
exports.tsFor = tsFor;