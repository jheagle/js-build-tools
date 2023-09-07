"use strict";

require("core-js/modules/es.array.reduce.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/esnext.async-iterator.reduce.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.reduce.js");
require("core-js/modules/es.promise.js");
var gulpConfig = require('../../gulp.config.js');
var removeDirectory = require('./removeDirectory');

/**
 * Deletes all the distribution and browser files (used before create a new build).
 * Configure array of directories to remove with 'cleanPaths'.
 * @function
 * @memberOf module:partials
 * @returns {Promise<string[]> | *}
 */
var clean = function clean() {
  return gulpConfig.get('cleanPaths').reduce(function (promise, path) {
    return promise.then(function () {
      return removeDirectory(path);
    });
  }, Promise.resolve());
};
module.exports = clean;