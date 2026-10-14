"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clean = void 0;
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.reduce.js");
var gulpConfig = _interopRequireWildcard(require("../../gulp.config.js"));
var _removeDirectory = require("./removeDirectory.js");
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
/**
 * Deletes all the distribution and browser files (used before create a new build).
 * Configure array of directories to remove with 'cleanPaths'.
 * @memberOf module:partials
 * @returns {Promise<string[]> | *}
 */
const clean = () => gulpConfig.get('cleanPaths').reduce((promise, path) => promise.then(() => (0, _removeDirectory.removeDirectory)(path)), Promise.resolve());
exports.clean = clean;