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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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