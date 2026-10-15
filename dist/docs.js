"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.docs = void 0;
var _jsdocDocs = require("./jsdocDocs.js");
var _resolveDocsMethod = require("./partials/resolveDocsMethod.js");
var _typeDocs = require("./typeDocs.js");
/**
 * Generate the HTML documentation with whichever engine docs.method (or its typescript.enabled-based default)
 * resolves to - see {@link module:partials.resolveDocsMethod}. The standalone counterpart to build's own
 * internal branching, for running `gulp docs` directly instead of as part of a full build.
 * @memberOf module:js-build-tools
 * @param {Function} [done]
 * @returns {*}
 */
const docs = (done = null) => ((0, _resolveDocsMethod.resolveDocsMethod)() === 'jsdoc' ? _jsdocDocs.jsdocDocs : _typeDocs.typeDocs)(done);
exports.docs = docs;