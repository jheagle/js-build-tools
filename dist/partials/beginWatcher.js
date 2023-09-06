"use strict";

var gulpConfig = require('../../gulp.config.js');
var _require = require('gulp'),
  watch = _require.watch;

/**
 * Create a chokidar instance which watches and triggers change when the globed files are modified.
 * @function
 * @memberOf module:partials
 * @returns {FSWatcher}
 */
var beginWatcher = function beginWatcher() {
  return watch(gulpConfig.get('watchSearch'));
};
module.exports = beginWatcher;