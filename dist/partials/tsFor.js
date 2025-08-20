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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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