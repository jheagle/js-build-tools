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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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
  } = (0, _convertMjsFilesForDocs.convertMjsFilesForDocs)((0, _glob.globSync)(gulpConfig.get('readme.fromEsm') || []));
  return _jsdocToMarkdown.default.render({
    files: [...(0, _glob.globSync)(gulpConfig.get('readme.from')), ...esmFilePaths]
  }).finally(cleanUp).then(readme => _fs.default.appendFileSync(gulpConfig.get('readme.to') + gulpConfig.get('readme.file'), readme, gulpConfig.get('readmeOptions')));
};
exports.addToReadme = addToReadme;