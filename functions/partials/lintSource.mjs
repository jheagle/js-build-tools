import * as gulpConfig from '../../gulp.config.mjs'
import { dest, src } from 'gulp'
import { neostandardLint } from './neostandardLint.mjs'
import { Transform } from 'node:stream'

/**
 * Lint the project's source (srcPath, plus any extra folders in lint.include: .js, .mjs and .cjs, plus .ts when
 * typescript.enabled) with neostandard and write the automatic fixes back in place. Shared by the sourceLint (build)
 * and lint (standalone) tasks.
 * @memberOf module:partials
 * @param {Object} [options={}]
 * @param {boolean} [options.failOnError=false] - Fail once linting finishes if any errors could not be fixed.
 * @returns {stream.Stream}
 */
export const lintSource = ({ failOnError = false } = {}) => {
  const ts = gulpConfig.get('typescript.enabled')
  const extensions = ts ? '{js,mjs,cjs,ts}' : '{js,mjs,cjs}'
  const folders = [gulpConfig.get('srcPath'), ...[].concat(gulpConfig.get('lint.include') ?? [])]
    .map(folder => folder.replace(/\/+$/, ''))
  const patterns = folders.map(folder => `${folder}/**/*.${extensions}`)
  // Every file keeps its path relative to the working directory, so dest() writes each fix back where it came from,
  // whichever of the folders it was found in.
  const linter = neostandardLint({ fix: true, ts, rules: gulpConfig.get('lint.rules') })
  // Fail only once dest() has written every fixed file: gulp exits as soon as a task fails, so failing from the
  // linter itself (before dest() finished) could leave a file that dest() had opened, but not yet written, empty.
  // dest() passes each file on only after writing it, so this last step's flush runs after the final write. Files
  // are consumed here rather than passed on, so nothing downstream has to read them.
  const written = new Transform({
    objectMode: true,
    transform: (file, enc, callback) => callback(),
    flush: callback => failOnError && linter.totals.errors
      ? callback(new Error(`neostandard found ${linter.totals.errors} lint error(s) that could not be fixed automatically.`))
      : callback()
  })
  const saved = src(patterns, { base: process.cwd(), ignore: ['**/node_modules/**'] })
    .pipe(linter)
    .pipe(dest(process.cwd()))
  saved.pipe(written)
  // pipe() does not forward errors, and gulp only watches the returned stream, so pass any failure along.
  linter.on('error', error => written.destroy(error))
  saved.on('error', error => written.destroy(error))
  return written
}
