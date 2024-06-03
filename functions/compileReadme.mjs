import { addToReadme, readmeTemplate } from './partials.mjs'
import { series } from 'gulp'

/**
 * Generate the README.md file based off of the template, then append the generated documentation.
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
export const compileReadme = series(readmeTemplate, addToReadme)
