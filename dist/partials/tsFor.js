"use strict";

var _require = require('gulp'),
  dest = _require.dest,
  parallel = _require.parallel,
  src = _require.src;
var gulpConfig = require('../../gulp.config.js');
var ts = require('gulp-typescript');

/**
 * Starting at the source directory, find all the ts files and convert them into the distribution directory.
 * @function
 * @memberOf module:partials
 * @param {string|array} [srcPath='']
 * @param {string} [distPath='']
 * @returns {Function}
 * @see `https://www.typescriptlang.org/docs/handbook/gulp.html` for more info
 */
var tsFor = function tsFor() {
  var srcPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : gulpConfig.get('tsSearch');
  var distPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : gulpConfig.get('distPath');
  var declarationProject = ts.createProject(gulpConfig.get('useTsConfig'));
  var tsProject = ts.createProject(gulpConfig.get('useTsConfig'));
  var makeDeclarations = function makeDeclarations() {
    return src(srcPath).pipe(declarationProject()).dts.pipe(dest(distPath));
  };
  var compileJS = function compileJS() {
    return src(srcPath).pipe(tsProject()).js.pipe(dest(distPath));
  };
  return parallel(makeDeclarations, compileJS);
};
module.exports = tsFor;