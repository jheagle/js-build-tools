import { typeDocsFor } from './partials/typeDocsFor.mjs'

/**
 * Generate the HTML documentation of a TypeScript project from its source, with the modules mirroring the source
 * folders. Turn it on with docs.enabled, see {@link module:partials.typeDocsFor}.
 * @memberOf module:js-build-tools
 * @returns {Function}
 */
export const typeDocs = typeDocsFor()
