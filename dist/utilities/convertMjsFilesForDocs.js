"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertMjsFilesForDocs = void 0;
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.map.js");
var _fs = _interopRequireDefault(require("fs"));
var _os = _interopRequireDefault(require("os"));
var _path = _interopRequireDefault(require("path"));
var _esmNamedExportsToCjs = require("./esmNamedExportsToCjs.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Writes a rewritten (see {@link esmNamedExportsToCjs}) copy of each given `.mjs` file into a fresh, unique
 * directory under the OS temp directory, with a `.js` extension - jsdoc-to-markdown only recognizes `.js` as a
 * documentable file, regardless of whether its contents are actually CommonJS or ESM (it parses the real ESM
 * syntax of the rest of a file fine; the extension is the only thing it filters on). Writing outside the project
 * tree means there is nothing to gitignore and nothing left behind in the project - call the returned `cleanUp`
 * once done (for example, right after jsdoc-to-markdown has read the files) to remove the temp directory.
 * @memberOf module:utilities
 * @param {Array<string>} mjsFilePaths - Real `.mjs` files to convert. An empty array is a safe, cheap no-op.
 * @returns {{filePaths: Array<string>, cleanUp: function(): void}} The temp `.js` file paths to pass to
 * jsdoc-to-markdown instead of the real `.mjs` ones, and a function to remove the temp directory afterward.
 * @private
 */
const convertMjsFilesForDocs = (mjsFilePaths = []) => {
  if (mjsFilePaths.length === 0) {
    return {
      filePaths: [],
      cleanUp: () => {}
    };
  }
  const tempDir = _fs.default.mkdtempSync(_path.default.join(_os.default.tmpdir(), 'js-build-tools-docs-'));
  const filePaths = mjsFilePaths.map(mjsFilePath => {
    const tempFilePath = _path.default.join(tempDir, _path.default.basename(mjsFilePath, '.js') + '.js');
    const source = _fs.default.readFileSync(mjsFilePath, 'utf8');
    _fs.default.writeFileSync(tempFilePath, (0, _esmNamedExportsToCjs.esmNamedExportsToCjs)(source));
    return tempFilePath;
  });
  return {
    filePaths,
    cleanUp: () => _fs.default.rmSync(tempDir, {
      recursive: true,
      force: true
    })
  };
};
exports.convertMjsFilesForDocs = convertMjsFilesForDocs;