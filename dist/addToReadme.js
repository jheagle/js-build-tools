'use strict'

require('core-js/modules/es.array.map.js')
require('core-js/modules/esnext.async-iterator.map.js')
require('core-js/modules/esnext.iterator.map.js')
require('core-js/modules/es.array.concat.js')
var filenames = require('gulp-filenames')
var fs = require('fs')
var gulpConfig = require('../gulp.config.js')
var jsdoc2md = require('jsdoc-to-markdown')
var _require = require('gulp')
var src = _require.src

/**
 * Appends all the jsdoc comments to the readme file. Assumes empty or templated file.
 * @returns {string|Uint8Array}
 */
var addToReadme = function addToReadme () {
  return src(gulpConfig.srcSearch).pipe(filenames('readme')).on('end', function () {
    var readme = jsdoc2md.renderSync({
      files: filenames.get('readme').map(function (file) {
        return ''.concat(gulpConfig.srcPath, '/').concat(file)
      })
    })
    fs.appendFileSync('README.md', readme, 'utf8')
    return readme
  })
}
module.exports = addToReadme
