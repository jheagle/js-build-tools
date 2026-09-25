import { dest, src } from 'gulp'
import path from 'node:path'
import * as gulpConfig from '../../gulp.config.mjs'
import { importModule, requirePeer } from './loadPeer.mjs'

// gulp-ts-compile ships ESM-only (no CJS build - see its own package.json), see importModule for how it is imported.
const importGulpTsCompile = () => importModule('gulp-ts-compile')

/**
 * Wrap a stream in a promise that resolves once it finishes writing.
 * @memberOf module:partials
 * @param {import('node:stream').Stream} stream
 * @returns {Promise<void>}
 */
const installHint = 'Install it in your project with: npm install --save-dev typescript'

/**
 * Load the project's own copy of TypeScript (an optional peer dependency, only needed when the typescript task is
 * enabled) from the project being built, so projects which do not use TypeScript never need it installed.
 * @memberOf module:partials
 * @param {string} [projectPath=process.cwd()] The folder of the project (which has the package.json) being built.
 * @returns {Object} The TypeScript compiler API module.
 * @throws {Error} With install instructions when typescript is not installed.
 */
export const loadTypescript = (projectPath = process.cwd()) => requirePeer('typescript', { task: 'typescript', installHint, projectPath })

const streamToPromise = (stream) => new Promise((resolve, reject) => {
  stream.on('finish', resolve)
  stream.on('error', reject)
})

/**
 * Read a tsconfig.json file into real typescript.CompilerOptions values, using only TypeScript's stable, current,
 * public config-reading API (the same one `tsc --project` itself uses internally) - never
 * `ts.convertCompilerOptionsFromJson`, which is exactly the kind of internal/legacy surface that broke
 * gulp-typescript when a removed API call started throwing under TypeScript 7.
 * @memberOf module:partials
 * @param {string} configPath - Path to a tsconfig.json file.
 * @returns {import('typescript').CompilerOptions}
 */
const readCompilerOptions = (ts, configPath) => {
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
  const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath))
  return parsedConfig.options
}

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
export const tsFor = (
  srcPath = gulpConfig.get('typescript.from'),
  distPath = gulpConfig.get('typescript.to'),
  loadTsCompile = () => importGulpTsCompile().then(({ default: tsCompile }) => tsCompile)
) => {
  if (gulpConfig.get('typescript.enabled') === false) {
    return () => {}
  }
  const ts = loadTypescript()
  const configPath = gulpConfig.get('typescript.config')
  // When no tsconfig.json is configured, target/module are pinned explicitly rather than left for TypeScript's
  // own compiler defaults - those defaults have already shifted once across a TypeScript version bump in this
  // project's own history (silently changing whether output keeps `const`/`let` or downlevels to `var`), and
  // pinning them keeps this task's output stable across future TypeScript upgrades too. ES5/CommonJS matches
  // what the downstream babel/browserify bundling pipeline has always assumed it receives.
  const compilerOptions = configPath
    ? readCompilerOptions(ts, configPath)
    : { declaration: true, target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS, esModuleInterop: false }
  // Accepts gulp's own callback-style task convention (an optional `done`, called once finished) rather than
  // just returning a Promise, since callers may invoke the returned function directly with a callback instead
  // of relying on gulp's own runner to observe a returned Promise.
  return (done) => {
    const compile = async () => {
      const tsCompile = await loadTsCompile()
      const tsResult = src(srcPath).pipe(tsCompile(compilerOptions))
      await Promise.all([
        streamToPromise(tsResult.dts.pipe(dest(distPath))),
        streamToPromise(tsResult.js.pipe(dest(distPath)))
      ])
    }
    return typeof done === 'function' ? compile().then(() => done(), done) : compile()
  }
}
