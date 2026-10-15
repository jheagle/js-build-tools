import { jsdocDocs } from './jsdocDocs.mjs'
import { resolveDocsMethod } from './partials/resolveDocsMethod.mjs'
import { typeDocs } from './typeDocs.mjs'

/**
 * Generate the HTML documentation with whichever engine docs.method (or its typescript.enabled-based default)
 * resolves to - see {@link module:partials.resolveDocsMethod}. The standalone counterpart to build's own
 * internal branching, for running `gulp docs` directly instead of as part of a full build.
 * @memberOf module:js-build-tools
 * @param {Function} [done]
 * @returns {*}
 */
export const docs = (done = null) => (resolveDocsMethod() === 'jsdoc' ? jsdocDocs : typeDocs)(done)
