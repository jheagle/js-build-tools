const fs = require('fs')
const gulpConfig = require('../../gulp.config.js')
const jsdoc2md = require('jsdoc-to-markdown')
const { globSync } = require('glob')

/**
 * Appends all the jsdoc comments to the readme file. Assumes empty or templated file.
 * Configure this with 'readmeSearch', 'readmePath', 'readmeFile', and 'readmeOptions'.
 * @memberOf module:partials
 * @returns {string|Uint8Array}
 */
const addToReadme = () => jsdoc2md
  .render({ files: globSync(gulpConfig.get('readme.from')) })
  .then(
    readme => fs.appendFileSync(gulpConfig.get('readme.to') + gulpConfig.get('readme.file'), readme, gulpConfig.get('readmeOptions'))
  )

module.exports = addToReadme
