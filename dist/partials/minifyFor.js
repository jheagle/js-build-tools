"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.minifyFor = void 0;
var _gulp = require("gulp");
var _gulpUglifyEs = _interopRequireDefault(require("gulp-uglify-es"));
var _gulpRename = _interopRequireDefault(require("gulp-rename"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const uglify = _gulpUglifyEs.default.hasOwnProperty('default') ? _gulpUglifyEs.default.default : _gulpUglifyEs.default;

/**
 * Minify files and rename the output with '.min' extension.
 * @memberOf module:partials
 * @returns {*}
 */
const minifyFor = (srcSearch, destination) => (0, _gulp.src)(srcSearch).pipe(uglify()).pipe((0, _gulpRename.default)({
  extname: '.min.js'
})).pipe((0, _gulp.dest)(destination));
exports.minifyFor = minifyFor;