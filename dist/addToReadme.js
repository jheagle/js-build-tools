'use strict'

var fs = require('fs')
var gulpConfig = require('../gulp.config.js')
var jsdoc2md = require('jsdoc-to-markdown')
var glob = require('glob')

/**
 * Appends all the jsdoc comments to the readme file. Assumes empty or templated file.
 * @returns {string|Uint8Array}
 */
var addToReadme = function addToReadme (done) {
  var files = glob.sync(gulpConfig.srcSearch)
  var readme = jsdoc2md.renderSync({
    files: files
  })
  fs.appendFileSync('README.md', readme, 'utf8')
  done()
}
module.exports = addToReadme
