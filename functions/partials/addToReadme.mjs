import fs from 'fs'
import * as gulpConfig from '../../gulp.config.mjs'
import jsdoc2md from 'jsdoc-to-markdown'
import { globSync } from 'glob'

/**
 * Appends all the jsdoc comments to the readme file. Assumes empty or templated file.
 * Configure this with 'readmeSearch', 'readmePath', 'readmeFile', and 'readmeOptions'.
 * @memberOf module:partials
 * @returns {string|Uint8Array}
 */
export const addToReadme = () => jsdoc2md
  .render({ files: globSync(gulpConfig.get('readme.from')) })
  .then(
    readme => fs.appendFileSync(gulpConfig.get('readme.to') + gulpConfig.get('readme.file'), readme, gulpConfig.get('readmeOptions'))
  )
