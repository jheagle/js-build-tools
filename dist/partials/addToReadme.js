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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Appends all the jsdoc comments to the readme file. Assumes empty or templated file.
 * Configure this with 'readmeSearch', 'readmePath', 'readmeFile', and 'readmeOptions'.
 * @memberOf module:partials
 * @returns {string|Uint8Array}
 */
const addToReadme = () => _jsdocToMarkdown.default.render({
  files: (0, _glob.globSync)(gulpConfig.get('readme.from'))
}).then(readme => _fs.default.appendFileSync(gulpConfig.get('readme.to') + gulpConfig.get('readme.file'), readme, gulpConfig.get('readmeOptions')));
exports.addToReadme = addToReadme;