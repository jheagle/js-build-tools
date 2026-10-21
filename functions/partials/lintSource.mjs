import * as gulpConfig from '../../gulp.config.mjs'
import { dest, src } from 'gulp'
import { neostandardLint } from './neostandardLint.mjs'

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
  const linter = neostandardLint({ fix: true, ts, rules: gulpConfig.get('lint.rules'), failOnError })
  const written = src(patterns)
    .pipe(linter)
    .pipe(dest(srcPath))
  // pipe() does not forward errors, and gulp only watches the returned stream, so pass the linter's failure along.
  linter.on('error', error => written.emit('error', error))
  return written
}
