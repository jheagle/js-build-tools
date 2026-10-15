"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyFor = void 0;
var _gulp = require("gulp");
/**
 * Copy some files to a different location.
 * @memberOf module:partials
 * @param {string|array} srcPath
 * @param {string} destPath
 * @param {Object} [options]
 * @param {string} [options.base] - Passed through to gulp's own src(pattern, {base}), to preserve srcPath's own
 * subdirectory structure in destPath instead of flattening it.
 * @returns {stream.Stream}
 */
// encoding: false copies the bytes untouched - Gulp 5's default utf8 handling corrupts binary files such as fonts.
const copyFor = (srcPath, destPath, {
  base
} = {}) => (0, _gulp.src)(srcPath, {
  encoding: false,
  ...(base ? {
    base
  } : {})
}).pipe((0, _gulp.dest)(destPath));
exports.copyFor = copyFor;