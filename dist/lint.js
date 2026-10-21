"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lint = void 0;
var _lintSource = require("./partials/lintSource.js");
/**
 * The standalone lint command (`gulp lint`, or `npm run lint`): the same linting and fixing as sourceLint, but it
 * fails (exits non-zero) when any errors remain that neostandard could not fix automatically.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
const lint = () => (0, _lintSource.lintSource)({
  failOnError: true
});
exports.lint = lint;