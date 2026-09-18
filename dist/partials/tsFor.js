"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tsFor = void 0;
var _gulp = require("gulp");
var _nodePath = _interopRequireDefault(require("node:path"));
var gulpConfig = _interopRequireWildcard(require("../../gulp.config.js"));
var _typescript = _interopRequireDefault(require("typescript"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// gulp-ts-compile ships ESM-only (no CJS build - see its own package.json) since it's meant to be consumed by
// gulpfiles running under a real ESM loader, same as this project's own gulpfile.mjs does. This project also
// compiles itself to a CommonJS build (dist/*.js, this file's own compiled counterpart) for consumers using
// require() though, and even a dynamic `import()` gets downleveled by babel's CommonJS transform into a
// require() call - which can't load a real ES module. Hiding the import() call inside a Function constructor is
// the standard escape hatch: babel can't see (and so can't rewrite) an import expression that only exists as a
// runtime-evaluated string, so it survives as a genuine dynamic import, capable of loading gulp-ts-compile from
// either build.
const importGulpTsCompile = new Function('return import(\'gulp-ts-compile\')');

/**
 * Wrap a stream in a promise that resolves once it finishes writing.
 * @memberOf module:partials
 * @param {import('node:stream').Stream} stream
 * @returns {Promise<void>}
 */
const streamToPromise = stream => new Promise((resolve, reject) => {
  stream.on('finish', resolve);
  stream.on('error', reject);
});

/**
 * Read a tsconfig.json file into real typescript.CompilerOptions values, using only TypeScript's stable, current,
 * public config-reading API (the same one `tsc --project` itself uses internally) - never
 * `ts.convertCompilerOptionsFromJson`, which is exactly the kind of internal/legacy surface that broke
 * gulp-typescript when a removed API call started throwing under TypeScript 7.
 * @memberOf module:partials
 * @param {string} configPath - Path to a tsconfig.json file.
 * @returns {import('typescript').CompilerOptions}
 */
const readCompilerOptions = configPath => {
  const configFile = _typescript.default.readConfigFile(configPath, _typescript.default.sys.readFile);
  const parsedConfig = _typescript.default.parseJsonConfigFileContent(configFile.config, _typescript.default.sys, _nodePath.default.dirname(configPath));
  return parsedConfig.options;
};

/**
 * Starting at the source directory, find all the ts files and convert them into the distribution directory.
 * @memberOf module:partials
 * @param {string|array} [srcPath='']
 * @param {string} [distPath='']
 * @param {function(): Promise<Function>} [loadTsCompile] - Resolves the `gulp-ts-compile` default export. Real
 * callers should never need to pass this - it exists so tests can inject a stand-in compiler, sidestepping the
 * genuine dynamic `import()` above that this project's current CommonJS-transform-based Jest setup cannot
 * execute without a broader (and riskier) migration to Jest's native ESM support. gulp-ts-compile's own test
 * suite already covers real TypeScript-compile correctness - this function's own tests only need to verify its
 * config resolution and stream wiring.
 * @returns {Function}
 */
const tsFor = (srcPath = gulpConfig.get('typescript.from'), distPath = gulpConfig.get('typescript.to'), loadTsCompile = () => importGulpTsCompile().then(({
  default: tsCompile
}) => tsCompile)) => {
  if (gulpConfig.get('typescript.enabled') === false) {
    return () => {};
  }
  const configPath = gulpConfig.get('typescript.config');
  const compilerOptions = configPath ? readCompilerOptions(configPath) : {
    declaration: true
  };
  // Accepts gulp's own callback-style task convention (an optional `done`, called once finished) rather than
  // just returning a Promise, since callers may invoke the returned function directly with a callback instead
  // of relying on gulp's own runner to observe a returned Promise.
  return done => {
    const compile = async () => {
      const tsCompile = await loadTsCompile();
      const tsResult = (0, _gulp.src)(srcPath).pipe(tsCompile(compilerOptions));
      await Promise.all([streamToPromise(tsResult.dts.pipe((0, _gulp.dest)(distPath))), streamToPromise(tsResult.js.pipe((0, _gulp.dest)(distPath)))]);
    };
    return typeof done === 'function' ? compile().then(() => done(), done) : compile();
  };
};
exports.tsFor = tsFor;