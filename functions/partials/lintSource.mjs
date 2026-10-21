import * as gulpConfig from '../../gulp.config.mjs'
import { dest, src } from 'gulp'
import { neostandardLint } from './neostandardLint.mjs'
import { Transform } from 'node:stream'

/**
 * Lint the project's source (srcPath: .js, .mjs and .cjs, plus .ts when typescript.enabled) with neostandard and
 * write the automatic fixes back in place. Shared by the sourceLint (build) and lint (standalone) tasks.
 * @memberOf module:partials
 * @param {Object} [options={}]
 * @param {boolean} [options.failOnError=false] - Fail once linting finishes if any errors could not be fixed.
 * @returns {stream.Stream}
 */
export const lintSource = ({ failOnError = false } = {}) => {
  const srcPath = gulpConfig.get('srcPath')
  const ts = gulpConfig.get('typescript.enabled')
  const patterns = [`${srcPath}/**/*.{js,mjs,cjs}`]
  if (ts) {
    patterns.push(`${srcPath}/**/*.ts`)
  }
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
  const saved = src(patterns)
    .pipe(linter)
    .pipe(dest(srcPath))
  saved.pipe(written)
  // pipe() does not forward errors, and gulp only watches the returned stream, so pass any failure along.
  linter.on('error', error => written.destroy(error))
  saved.on('error', error => written.destroy(error))
  return written
}
