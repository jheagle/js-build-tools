"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sourceLint = void 0;
var gulpConfig = _interopRequireWildcard(require("../gulp.config.js"));
var _gulp = require("gulp");
var _neostandardLint = require("./partials/neostandardLint.js");
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
/**
 * Applies neostandard linting (js-build-tools' chosen style) to the real, hand-written source - not the compiled
 * dist/browser output, which is generated and so was never going to pass a hand-authored-code style check (every
 * compiler/bundler emits its own boilerplate - import aliasing, interop headers - that only looks like a style
 * violation). Includes test files: there is no reason to hold tests to a lower style bar than the rest of the
 * source. When typescript.enabled, the real TypeScript source is linted too, with type-aware rules.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
const sourceLint = () => {
  const srcPath = gulpConfig.get('srcPath');
  const ts = gulpConfig.get('typescript.enabled');
  const patterns = [`${srcPath}/**/*.js`];
  if (ts) {
    patterns.push(`${srcPath}/**/*.ts`);
  }
  return (0, _gulp.src)(patterns).pipe((0, _neostandardLint.neostandardLint)({
    fix: true,
    ts,
    rules: gulpConfig.get('lint.rules')
  })).pipe((0, _gulp.dest)(srcPath));
};
exports.sourceLint = sourceLint;