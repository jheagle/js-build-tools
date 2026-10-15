"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveDocsMethod = void 0;
var gulpConfig = _interopRequireWildcard(require("../../gulp.config.js"));
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
/**
 * Pick which engine generates the HTML documentation: docs.method picks it explicitly; left unset (false, the
 * default), it's inferred from typescript.enabled - every existing TypeScript project's config, which never
 * sets method, keeps producing TypeDoc output exactly as it always has.
 * @memberOf module:partials
 * @returns {'typedoc'|'jsdoc'}
 */
const resolveDocsMethod = () => gulpConfig.get('docs.method') || (gulpConfig.get('typescript.enabled') ? 'typedoc' : 'jsdoc');
exports.resolveDocsMethod = resolveDocsMethod;