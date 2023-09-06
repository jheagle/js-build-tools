"use strict";

var del = require('del');
var gulpConfig = require('../../gulp.config.js');

/**
 * Deletes all the distribution and browser files (used before create a new build).
 * @function
 * @memberOf module:partials
 * @param {function} [done=null]
 * @param {string[]} [paths=['dist/config/path', 'browser/config/path']]
 * @returns {Promise<string[]> | *}
 */
var clean = function clean() {
  var done = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var paths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [gulpConfig.get('distPath'), gulpConfig.get('browserPath')];
  return del(paths).then(function () {
    return done && done();
  });
};
module.exports = clean;