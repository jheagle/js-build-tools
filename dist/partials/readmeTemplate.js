"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readmeTemplate = void 0;
var _gulp = require("gulp");
var gulpConfig = _interopRequireWildcard(require("../../gulp.config.js"));
var _gulpRename = _interopRequireDefault(require("gulp-rename"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Copy a readme template into the README.md file.
 * @memberOf module:partials
 * @returns {*}
 */
const readmeTemplate = () => (0, _gulp.src)(gulpConfig.get('readme.template')).pipe((0, _gulpRename.default)(gulpConfig.get('readme.file'))).pipe((0, _gulp.dest)(gulpConfig.get('readme.to')));
exports.readmeTemplate = readmeTemplate;