import fs from 'fs'
import * as gulpConfig from '../../gulp.config.mjs'
import jsdoc2md from 'jsdoc-to-markdown'
import { globSync } from 'glob'
import { convertMjsFilesForDocs } from '../utilities/convertMjsFilesForDocs.mjs'

/**
 * Appends all the jsdoc comments to the readme file. Assumes empty or templated file.
 * Configure this with 'readmeSearch', 'readmePath', 'readmeFile', and 'readmeOptions'.
 *
 * jsdoc-to-markdown only recognizes `.js` files, even though it parses real ESM syntax just fine once it reads
 * one - `readme.fromEsm` (empty by default) names `.mjs` files to include anyway, converted on the fly (see
 * {@link convertMjsFilesForDocs}) and cleaned up again once this has read them, win or lose.
 * @memberOf module:partials
 * @returns {string|Uint8Array}
 */
export const addToReadme = () => {
  const { filePaths: esmFilePaths, cleanUp } = convertMjsFilesForDocs(globSync(gulpConfig.get('readme.fromEsm')))
  return jsdoc2md
    .render({ files: [...globSync(gulpConfig.get('readme.from')), ...esmFilePaths] })
    .finally(cleanUp)
    .then(
      readme => fs.appendFileSync(gulpConfig.get('readme.to') + gulpConfig.get('readme.file'), readme, gulpConfig.get('readmeOptions'))
    )
}
