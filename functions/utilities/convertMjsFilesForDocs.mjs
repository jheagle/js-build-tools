import fs from 'fs'
import os from 'os'
import path from 'path'
import { esmNamedExportsToCjs } from './esmNamedExportsToCjs.mjs'

/**
 * Writes a rewritten (see {@link esmNamedExportsToCjs}) copy of each given `.mjs` file into a fresh, unique
 * directory under the OS temp directory, with a `.js` extension - jsdoc-to-markdown only recognizes `.js` as a
 * documentable file, regardless of whether its contents are actually CommonJS or ESM (it parses the real ESM
 * syntax of the rest of a file fine; the extension is the only thing it filters on). Writing outside the project
 * tree means there is nothing to gitignore and nothing left behind in the project - call the returned `cleanUp`
 * once done (for example, right after jsdoc-to-markdown has read the files) to remove the temp directory.
 * @memberOf module:utilities
 * @param {Array<string>} mjsFilePaths - Real `.mjs` files to convert. An empty array is a safe, cheap no-op.
 * @returns {{filePaths: Array<string>, cleanUp: function(): void}} The temp `.js` file paths to pass to
 * jsdoc-to-markdown instead of the real `.mjs` ones, and a function to remove the temp directory afterward.
 */
export const convertMjsFilesForDocs = (mjsFilePaths = []) => {
  if (mjsFilePaths.length === 0) {
    return { filePaths: [], cleanUp: () => {} }
  }
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'js-build-tools-docs-'))
  const filePaths = mjsFilePaths.map((mjsFilePath) => {
    const tempFilePath = path.join(tempDir, path.basename(mjsFilePath, '.mjs') + '.js')
    const source = fs.readFileSync(mjsFilePath, 'utf8')
    fs.writeFileSync(tempFilePath, esmNamedExportsToCjs(source))
    return tempFilePath
  })
  return {
    filePaths,
    cleanUp: () => fs.rmSync(tempDir, { recursive: true, force: true })
  }
}
