"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esmNamedExportsToCjs = void 0;
/**
 * Rewrites named `export const`/`export function`/`export class` declarations to plain declarations plus a
 * trailing `module.exports = { ... }` - the same shape jsdoc-to-markdown already documents cleanly (a plain
 * declaration with its own `@memberOf` tag, exported all at once at the bottom), rather than the "exports.name"
 * longname jsdoc-to-markdown's own ESM-compat layer produces for an inline `export const name = ...`.
 *
 * This is a narrow, text-level rewrite for documentation purposes only - it does not execute the module, so it
 * only has to look enough like the real thing for jsdoc-to-markdown's parser. It handles the common named-export
 * forms (`export const`, `export function`, `export class`) and leaves everything else (including `export
 * default`, re-exports, and `export { a, b }` lists) untouched in place - a file using one of those keeps its
 * own export line as-is, which jsdoc-to-markdown will document however it already does for ESM.
 * @memberOf module:utilities
 * @param {string} source - The raw ESM source text (never executed, just rewritten as text).
 * @returns {string} The rewritten text, safe to write out with a `.js` extension for jsdoc-to-markdown to read.
 */
const esmNamedExportsToCjs = source => {
  const exportedNames = [];
  const rewritten = source.replace(/^export (const|function|class) (\w+)/gm, (match, keyword, name) => {
    exportedNames.push(name);
    return `${keyword} ${name}`;
  });
  if (exportedNames.length === 0) {
    return rewritten;
  }
  return `${rewritten}\n\nmodule.exports = { ${exportedNames.join(', ')} }\n`;
};
exports.esmNamedExportsToCjs = esmNamedExportsToCjs;