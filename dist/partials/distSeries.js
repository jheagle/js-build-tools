"use strict";

var gulpConfig = require('../../gulp.config');
var distFor = require('./distFor');
var distForSrc = require('./distForSrc');
var _require = require('gulp'),
  series = _require.series;
var tsFor = require('./tsFor');

/**
 * When using TypeScript, ensure that we process the ts first then run babel (dist)
 * @function
 * @memberOf module:partials
 * @param {string} [srcPath='src/config/path/dist/for']
 * @param {string} [distFinalPath='dist/config/path']
 * @param {string} [tsSearch='ts/search/config/path']
 * @returns {function(null=): stream.Stream}
 */
var distSeries = function distSeries() {
  var srcPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : distForSrc();
  var distFinalPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : gulpConfig.get('distPath');
  var tsSearch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : gulpConfig.get('tsSearch');
  var typescript = tsFor(tsSearch, distFinalPath);
  var dist = function dist() {
    return distFor(srcPath, distFinalPath);
  };
  return gulpConfig.get('useTsConfig') ? series(typescript, dist) : dist;
};
module.exports = distSeries;