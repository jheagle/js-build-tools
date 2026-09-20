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
 * @returns {stream.Stream}
 */
// encoding: false copies the bytes untouched - Gulp 5's default utf8 handling corrupts binary files such as fonts.
const copyFor = (srcPath, destPath) => (0, _gulp.src)(srcPath, {
  encoding: false
}).pipe((0, _gulp.dest)(destPath));
exports.copyFor = copyFor;