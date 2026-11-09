import { addToReadme, readmeTemplate } from './partials.mjs'
import { series } from 'gulp'
import * as gulpConfig from '../gulp.config.mjs'

/**
 * Generate the README.md file based off of the template, then append the generated documentation. Does nothing when
 * readme.enabled is false, so a project can keep a hand-written readme (or none).
 * @memberOf module:js-build-tools
 * @param {Function} [done]
 * @returns {*}
 */
export const compileReadme = (done = null) => {
  if (gulpConfig.get('readme.enabled') === false) {
    if (typeof done === 'function') {
      done()
    }
    return Promise.resolve()
  }
  return series(readmeTemplate, addToReadme)(done)
}
