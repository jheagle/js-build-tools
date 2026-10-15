"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsdocDocs = void 0;
var _jsdocDocsFor = require("./partials/jsdocDocsFor.js");
/**
 * Generate the HTML documentation of a plain-JavaScript project from its source, with a modern jsdoc theme
 * instead of jsdoc's own classic default. Turn it on with docs.enabled and docs.method: 'jsdoc' (the default
 * when typescript.enabled is off), see {@link module:partials.jsdocDocsFor}.
 * @memberOf module:js-build-tools
 * @returns {Function}
 */
const jsdocDocs = exports.jsdocDocs = (0, _jsdocDocsFor.jsdocDocsFor)();