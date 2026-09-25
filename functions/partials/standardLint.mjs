import path from 'node:path'
import through from 'through2'
import { importModule } from './loadPeer.mjs'

// `standard` (17+) ships ESM-only, see importModule for how it is imported.
const importStandard = () => importModule('standard')

/**
 * Print a file's lint messages, if it has any.
 * @memberOf module:partials
 * @param {import('vinyl')} file
 * @param {{messages: Array<{line: number, column: number, message: string}>, errorCount: number, warningCount: number}} result
 * @returns {undefined}
 */
const printFileReport = (file, result) => {
  if (!result.messages.length) {
    return
  }
  console.log(path.relative(file.cwd, file.path))
  result.messages.forEach(({ line, column, message }) => console.log(`line ${line}:${column}\t${message}`))
  console.log(`✖ ${result.errorCount} error\t⚠ ${result.warningCount} warning\n`)
}

/**
 * Lint every file streaming through with JavaScript Standard Style and, unless `fix` is false, apply the automatic
 * fixes to the file's contents so a following `dest()` writes the fixed version. Remaining problems are printed
 * along with a summary once the stream ends; they never fail the build.
 *
 * Project-level Standard configuration (the `standard` field in package.json: ignore, env, globals, ...) is honored
 * because the file's own path and cwd are handed to Standard.
 * @memberOf module:partials
 * @param {Object} [options={}]
 * @param {boolean} [options.fix=true] - Apply Standard's automatic fixes to the file contents.
 * @param {function(): Promise<{lintText: Function}>} [loadStandard] - Resolves the `standard` module. Real callers
 * should never need to pass this - it exists so tests can supply a stand-in, since this project's
 * CommonJS-transform-based Jest setup cannot execute a real dynamic import() of an ES module.
 * @returns {import('stream').Transform}
 */
export const standardLint = (
  { fix = true } = {},
  loadStandard = () => importStandard().then(({ default: standard }) => standard)
) => {
  const totals = { errors: 0, warnings: 0 }
  return through.obj(
    function (file, enc, callback) {
      if (file.isNull()) {
        callback(null, file)
        return
      }
      if (file.isStream()) {
        callback(new Error('standardLint: streaming file contents are not supported.'))
        return
      }
      loadStandard()
        .then(standard => standard.lintText(file.contents.toString(), { filename: file.path, cwd: file.cwd, fix }))
        .then(results => {
          // No result at all means the file is ignored by the project's Standard configuration.
          const [result] = results
          if (result) {
            if (typeof result.output === 'string') {
              file.contents = Buffer.from(result.output)
            }
            totals.errors += result.errorCount
            totals.warnings += result.warningCount
            printFileReport(file, result)
          }
          callback(null, file)
        }, callback)
    },
    function (callback) {
      console.log('Standard linter results')
      console.log('======================================')
      console.log(`✖ Errors total: ${totals.errors}`)
      console.log(`⚠ Warnings total: ${totals.warnings}\n`)
      callback()
    }
  )
}
