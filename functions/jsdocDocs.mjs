import { jsdocDocsFor } from './partials/jsdocDocsFor.mjs'

/**
 * Generate the HTML documentation of a plain-JavaScript project from its source, with a modern jsdoc theme
 * instead of jsdoc's own classic default. Turn it on with docs.enabled and docs.method: 'jsdoc' (the default
 * when typescript.enabled is off), see {@link module:partials.jsdocDocsFor}.
 * @memberOf module:js-build-tools
 * @returns {Function}
 */
export const jsdocDocs = jsdocDocsFor()
