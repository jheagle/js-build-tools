'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.typeDocs = void 0
const _typeDocsFor = require('./partials/typeDocsFor.js')
/**
 * Generate the HTML documentation of a TypeScript project from its source, with the modules mirroring the source
 * folders. Turn it on with docs.enabled, see {@link module:partials.typeDocsFor}.
 * @memberOf module:js-build-tools
 * @returns {Function}
 */
const typeDocs = exports.typeDocs = (0, _typeDocsFor.typeDocsFor)()
