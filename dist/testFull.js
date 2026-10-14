"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testFull = void 0;
var gulpConfig = _interopRequireWildcard(require("../gulp.config.js"));
var _jest = require("jest");
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
/**
 * Run all tests with jest.
 * Configure where tests are located by using 'testPath'.
 * @memberOf module:js-build-tools
 * @returns {Promise<*>}
 */
const testFull = () => {
  let testPath = gulpConfig.get('test.path');
  if (!Array.isArray(testPath)) {
    // The testPath must be an array of strings
    testPath = [testPath];
  }
  return (0, _jest.runCLI)(gulpConfig.get('test.options'), testPath);
};
exports.testFull = testFull;