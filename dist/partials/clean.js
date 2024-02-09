"use strict";

require("core-js/modules/esnext.async-iterator.reduce.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.reduce.js");
const gulpConfig = require('../../gulp.config.js');
const removeDirectory = require('./removeDirectory');

/**
 * Deletes all the distribution and browser files (used before create a new build).
 * Configure array of directories to remove with 'cleanPaths'.
 * @memberOf module:partials
 * @returns {Promise<string[]> | *}
 */
const clean = () => gulpConfig.get('cleanPaths').reduce((promise, path) => promise.then(() => removeDirectory(path)), Promise.resolve());
module.exports = clean;