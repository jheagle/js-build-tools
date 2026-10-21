"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lintSource = void 0;
var gulpConfig = _interopRequireWildcard(require("../../gulp.config.js"));
var _gulp = require("gulp");
var _neostandardLint = require("./neostandardLint.js");
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
    rules: gulpConfig.get('lint.rules'),
    failOnError
  });
  const written = (0, _gulp.src)(patterns).pipe(linter).pipe((0, _gulp.dest)(srcPath));
  // pipe() does not forward errors, and gulp only watches the returned stream, so pass the linter's failure along.
  linter.on('error', error => written.emit('error', error));
  return written;
};
exports.lintSource = lintSource;