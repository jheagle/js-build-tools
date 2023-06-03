'use strict'

const fs = require('fs')
const gulpConfig = require('../gulp.config.js')
const jsdoc2md = require('jsdoc-to-markdown')
const {
  globSync
} = require('glob')

/**
 * Appends all the jsdoc comments to the readme file. Assumes empty or templated file.
 * @returns {string|Uint8Array}
 */
const addToReadme = done => {
  const files = globSync(gulpConfig.srcSearch)
  const readme = jsdoc2md.renderSync({
    files: files
  })
  fs.appendFileSync('README.md', readme, 'utf8')
  done()
}
module.exports = addToReadme
