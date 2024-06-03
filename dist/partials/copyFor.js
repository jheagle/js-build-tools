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
const copyFor = (srcPath, destPath) => (0, _gulp.src)(srcPath).pipe((0, _gulp.dest)(destPath));
exports.copyFor = copyFor;