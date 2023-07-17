const fs = require('fs')
const gulpConfig = require('../gulp.config.js')
const jsdoc2md = require('jsdoc-to-markdown')
const { globSync } = require('glob')

/**
 * Appends all the jsdoc comments to the readme file. Assumes empty or templated file.
 * @param {function|null} [done=null]
 * @returns {string|Uint8Array}
 */
const addToReadme = (done = null) => {
  const files = globSync(gulpConfig.get('srcSearch'))
  const readme = jsdoc2md.renderSync({ files: files })
  fs.appendFileSync(gulpConfig.get('readmePath') + gulpConfig.get('readmeFile'), readme, gulpConfig.get('readmeOptions'))
  return done && done()
}

module.exports = addToReadme
