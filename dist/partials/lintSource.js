"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lintSource = void 0;
var gulpConfig = _interopRequireWildcard(require("../../gulp.config.js"));
var _gulp = require("gulp");
var _neostandardLint = require("./neostandardLint.js");
var _nodeStream = require("node:stream");
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
/**
 * Lint the project's source (srcPath: .js, .mjs and .cjs, plus .ts when typescript.enabled) with neostandard and
 * write the automatic fixes back in place. Shared by the sourceLint (build) and lint (standalone) tasks.
 * @memberOf module:partials
 * @param {Object} [options={}]
 * @param {boolean} [options.failOnError=false] - Fail once linting finishes if any errors could not be fixed.
 * @returns {stream.Stream}
 */
const lintSource = ({
  failOnError = false
} = {}) => {
  const srcPath = gulpConfig.get('srcPath');
  const ts = gulpConfig.get('typescript.enabled');
  const patterns = [`${srcPath}/**/*.{js,mjs,cjs}`];
  if (ts) {
    patterns.push(`${srcPath}/**/*.ts`);
  }
  const linter = (0, _neostandardLint.neostandardLint)({
    fix: true,
    ts,
    rules: gulpConfig.get('lint.rules')
  });
  // Fail only once dest() has written every fixed file: gulp exits as soon as a task fails, so failing from the
  // linter itself (before dest() finished) could leave a file that dest() had opened, but not yet written, empty.
  // dest() passes each file on only after writing it, so this last step's flush runs after the final write. Files
  // are consumed here rather than passed on, so nothing downstream has to read them.
  const written = new _nodeStream.Transform({
    objectMode: true,
    transform: (file, enc, callback) => callback(),
    flush: callback => failOnError && linter.totals.errors ? callback(new Error(`neostandard found ${linter.totals.errors} lint error(s) that could not be fixed automatically.`)) : callback()
  });
  const saved = (0, _gulp.src)(patterns).pipe(linter).pipe((0, _gulp.dest)(srcPath));
  saved.pipe(written);
  // pipe() does not forward errors, and gulp only watches the returned stream, so pass any failure along.
  linter.on('error', error => written.destroy(error));
  saved.on('error', error => written.destroy(error));
  return written;
};
exports.lintSource = lintSource;