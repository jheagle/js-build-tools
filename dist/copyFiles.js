"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyFiles = void 0;
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.map.js");
var _copyFor = require("./partials/copyFor.js");
var gulpConfig = _interopRequireWildcard(require("../gulp.config.js"));
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
/**
 * Copy files from one place to another - any number of { from, to, base? } entries, configured via copyFiles.
 * A project with no copyFiles entries gets a task that does nothing. Meant to be run explicitly (its own script,
 * e.g. `gulp copyFiles`), not folded into the default build - a bundle (or any other file this copies) is often
 * the live, publicly-reachable version of something, so publishing it elsewhere should be a deliberate step, not
 * a side effect of every routine local build.
 *
 * Reuses copyFor (already shared with copyFonts) rather than a fresh src()/dest() pair - that keeps its existing
 * encoding: false fix (Gulp 5's default utf8 handling corrupts binary files such as fonts or a minified bundle)
 * instead of silently losing it in a parallel implementation.
 *
 * Each entry runs as its own independent copyFor(), awaited via Promise.all rather than merged into one combined
 * stream (mergeStream, the pattern bundle.mjs uses) - that pattern assumes every merged stream ends up at the
 * same shared destination; here, each entry can have a genuinely different one, and merging streams that each
 * already terminate at their own separate dest() hit a real "write after end" error in practice.
 * @memberOf module:js-build-tools
 * @returns {Promise<void>}
 */
const copyFiles = () => {
  const copies = gulpConfig.get('copyFiles', []);
  if (!copies.length) {
    return Promise.resolve();
  }
  return Promise.all(copies.map(({
    from,
    to,
    base
  }) => new Promise((resolve, reject) => {
    (0, _copyFor.copyFor)(from, to, {
      base
    }).on('finish', resolve).on('error', reject);
  }))).then(() => {});
};
exports.copyFiles = copyFiles;