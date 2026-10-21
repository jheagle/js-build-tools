"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sourceLint = void 0;
var _lintSource = require("./partials/lintSource.js");
/**
 * Applies neostandard linting (js-build-tools' chosen style) to the real, hand-written source - not the compiled
 * dist/browser output, which is generated and so was never going to pass a hand-authored-code style check (every
 * compiler/bundler emits its own boilerplate - import aliasing, interop headers - that only looks like a style
 * violation). Includes test files: there is no reason to hold tests to a lower style bar than the rest of the
 * source. When typescript.enabled, the real TypeScript source is linted too, with type-aware rules. Runs as part of
 * `build`, where remaining errors are reported but never fail it.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
const sourceLint = () => (0, _lintSource.lintSource)();
exports.sourceLint = sourceLint;