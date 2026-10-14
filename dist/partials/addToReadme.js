"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addToReadme = void 0;
var _fs = _interopRequireDefault(require("fs"));
var gulpConfig = _interopRequireWildcard(require("../../gulp.config.js"));
var _jsdocToMarkdown = _interopRequireDefault(require("jsdoc-to-markdown"));
var _glob = require("glob");
var _convertMjsFilesForDocs = require("../utilities/convertMjsFilesForDocs.js");
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Appends all the jsdoc comments to the readme file. Assumes empty or templated file.
 * Configure this with 'readmeSearch', 'readmePath', 'readmeFile', and 'readmeOptions'.
 *
 * jsdoc-to-markdown only recognizes `.js` files, even though it parses real ESM syntax just fine once it reads
 * one - `readme.fromEsm` (empty by default) names `.mjs` files to include anyway, converted on the fly (see
 * {@link convertMjsFilesForDocs}) and cleaned up again once this has read them, win or lose.
 * @memberOf module:partials
 * @returns {string|Uint8Array}
 */
const addToReadme = () => {
  const {
    filePaths: esmFilePaths,
    cleanUp
  } = (0, _convertMjsFilesForDocs.convertMjsFilesForDocs)((0, _glob.globSync)(gulpConfig.get('readme.fromEsm')));
  return _jsdocToMarkdown.default.render({
    files: [...(0, _glob.globSync)(gulpConfig.get('readme.from')), ...esmFilePaths]
  }).finally(cleanUp).then(readme => _fs.default.appendFileSync(gulpConfig.get('readme.to') + gulpConfig.get('readme.file'), readme, gulpConfig.get('readmeOptions')));
};
exports.addToReadme = addToReadme;