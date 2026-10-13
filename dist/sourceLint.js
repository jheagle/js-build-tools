"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sourceLint = void 0;
var gulpConfig = _interopRequireWildcard(require("../gulp.config.js"));
var _gulp = require("gulp");
var _neostandardLint = require("./partials/neostandardLint.js");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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
    ts
  })).pipe((0, _gulp.dest)(srcPath));
};
exports.sourceLint = sourceLint;