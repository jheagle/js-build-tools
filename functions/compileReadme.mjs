import { addToReadme, readmeTemplate } from './partials.mjs'
import { series } from 'gulp'
import { globSync } from 'glob'
import * as gulpConfig from '../gulp.config.mjs'

/**
 * Finish without doing anything.
 * @param {Function} [done]
 * @returns {Promise<void>}
 */
const skip = done => {
  if (typeof done === 'function') {
    done()
  }
  return Promise.resolve()
}

/**
 * Generate the README.md file based off of the template, then append the generated documentation. Does nothing when
 * readme.enabled is false, so a project can keep a hand-written readme (or none). Also does nothing, with a warning,
 * when no file matches readme.from or readme.fromEsm (a TypeScript project's src has no .js files, say): writing the
 * template and then failing to document anything would leave a broken readme behind.
 * @memberOf module:js-build-tools
 * @param {Function} [done]
 * @returns {*}
 */
export const compileReadme = (done = null) => {
  if (gulpConfig.get('readme.enabled') === false) {
    return skip(done)
  }
  const from = gulpConfig.get('readme.from')
  const fromEsm = gulpConfig.get('readme.fromEsm')
  if (globSync(from).length + globSync(fromEsm).length === 0) {
    const readmePath = gulpConfig.get('readme.to') + gulpConfig.get('readme.file')
    console.warn(`No files match readme.from (${from})${[].concat(fromEsm).length ? ` or readme.fromEsm (${fromEsm})` : ''}: ${readmePath} was left as it is. Point readme.from at the files to document (the compiled .js, for TypeScript), or set readme.enabled to false to keep a hand-written readme.`)
    return skip(done)
  }
  return series(readmeTemplate, addToReadme)(done)
}
