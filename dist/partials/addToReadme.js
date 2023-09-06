"use strict";

var fs = require('fs');
var gulpConfig = require('../../gulp.config.js');
var jsdoc2md = require('jsdoc-to-markdown');
var _require = require('glob'),
  globSync = _require.globSync;

/**
 * Appends all the jsdoc comments to the readme file. Assumes empty or templated file.
 * @function
 * @memberOf module:partials
 * @param {function|null} [done=null]
 * @returns {string|Uint8Array}
 */
var addToReadme = function addToReadme() {
  var done = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var files = globSync(gulpConfig.get('readmeSearch'));
  var readme = jsdoc2md.renderSync({
    files: files
  });
  fs.appendFileSync(gulpConfig.get('readmePath') + gulpConfig.get('readmeFile'), readme, gulpConfig.get('readmeOptions'));
  return done && done();
};
module.exports = addToReadme;