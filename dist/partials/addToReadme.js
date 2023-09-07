"use strict";

var fs = require('fs');
var gulpConfig = require('../../gulp.config.js');
var jsdoc2md = require('jsdoc-to-markdown');
var _require = require('glob'),
  globSync = _require.globSync;

/**
 * Appends all the jsdoc comments to the readme file. Assumes empty or templated file.
 * Configure this with 'readmeSearch', 'readmePath', 'readmeFile', and 'readmeOptions'.
 * @function
 * @memberOf module:partials
 * @returns {string|Uint8Array}
 */
var addToReadme = function addToReadme() {
  return jsdoc2md.render({
    files: globSync(gulpConfig.get('readmeSearch'))
  }).then(function (readme) {
    return fs.appendFileSync(gulpConfig.get('readmePath') + gulpConfig.get('readmeFile'), readme, gulpConfig.get('readmeOptions'));
  });
};
module.exports = addToReadme;