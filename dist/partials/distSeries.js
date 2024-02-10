"use strict";

const gulpConfig = require('../../gulp.config');
const distFor = require('./distFor');
const distForSrc = require('./distForSrc');
const {
  series
} = require('gulp');
const tsFor = require('./tsFor');

/**
 * When using TypeScript, ensure that we process the ts first then run babel (dist)
 * @memberOf module:partials
 * @param {string} [srcPath='src/config/path/dist/for']
 * @param {string} [distFinalPath='dist/config/path']
 * @param {string} [tsSearch='ts/search/config/path']
 * @returns {function(null=): stream.Stream}
 */
const distSeries = function () {
  let srcPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : distForSrc();
  let distFinalPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : gulpConfig.get('dist.to');
  let tsSearch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : gulpConfig.get('typescript.from');
  const typescript = tsFor(tsSearch, distFinalPath);
  const dist = () => distFor(srcPath, distFinalPath);
  return gulpConfig.get('typescript.enabled') ? series(typescript, dist) : dist;
};
module.exports = distSeries;