import * as esbuild from 'esbuild'
import { existsSync, readFileSync } from 'fs'
import { readFile } from 'fs/promises'
import { dest } from 'gulp'
import { builtinModules, createRequire } from 'module'
import path from 'path'
import { PassThrough } from 'stream'
import Vinyl from 'vinyl'
import * as gulpConfig from '../gulp.config.mjs'
import { getBundleConfigs } from './utilities/getBundleConfigs.mjs'

/**
 * Resolve one of js-build-tools' own dependencies (a browser shim) to a file path. Resolved from the project first,
 * where npm normally hoists it, then from js-build-tools' own install (a nested copy when versions conflict). No
 * import.meta here: this file is also compiled to CommonJS (dist/), where import.meta is a syntax error.
 * @param {string} request
 * @returns {string}
 * @private
 */
const resolveShim = (request) => {
  const fromProject = createRequire(path.join(process.cwd(), 'package.json'))
  try {
    return fromProject.resolve(request)
  } catch {
    return createRequire(fromProject.resolve('js-build-tools')).resolve(request)
  }
}

/**
 * Browser stand-ins for the Node built-ins that browserify used to provide and that real bundles still reach:
 * `path` (json-file-db) and `process` (guarded `typeof process` checks in debug and css-select's dependencies).
 * Any other built-in is first looked up as an ordinary package (so a project can install its own shim, e.g.
 * `events` or `buffer`), and otherwise becomes an empty object, the way browserify always treated `fs`.
 * @type {Object<string, string>}
 * @private
 */
const builtinShims = {
  path: 'path-browserify',
  process: 'process/browser.js'
}

const builtins = new Set(builtinModules)

const emptyNamespace = 'js-build-tools-empty'

/**
 * The module injected for a free `process` reference (browserify inserted the same stand-in). esbuild only adds it
 * to bundles that actually reference `process`.
 * @private
 */
const processInject = 'js-build-tools:process'
const processInjectNamespace = 'js-build-tools-inject'
const processShimImport = 'js-build-tools:process-browser'
const commonJsNamespace = 'js-build-tools-cjs'

/**
 * The absolute dist.to when the package.json nearest to it (the one esbuild reads) says `"type": "module"` (see
 * browserifyCompat), else null.
 * @returns {string|null}
 * @private
 */
const commonJsDistRoot = () => {
  const distRoot = path.resolve(gulpConfig.get('dist.to'))
  for (let directory = distRoot; ; directory = path.dirname(directory)) {
    const packageFile = path.join(directory, 'package.json')
    if (existsSync(packageFile)) {
      return JSON.parse(readFileSync(packageFile, 'utf8')).type === 'module' ? distRoot : null
    }
    if (path.dirname(directory) === directory) {
      return null
    }
  }
}

/**
 * Turn a bundle name into the global it is exposed as, exactly as browserify's `standalone` option (via the umd
 * package) did: dashes followed by a lowercase letter are camel-cased, then anything not valid in an identifier is
 * dropped, per dot-separated segment. So `matrix-dom` stays `matrix-dom.js` on disk but is `window.matrixDom`.
 * @memberOf module:utilities
 * @param {string} name
 * @returns {string}
 * @private
 */
export const toGlobalName = (name) => name.split('.')
  .map((segment) => {
    const result = segment.replace(/-([a-z])/g, (_, char) => char.toUpperCase()).replace(/[^\w$]+/g, '')
    if (!result) {
      throw new Error(`Bundle name "${name}" does not give a valid JavaScript identifier`)
    }
    return result
  })
  .join('.')

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Whether browserify's ignore would have matched this import, by the same four rules browserify used: the import
 * id itself, the resolved file (entries starting with '.' are resolved against the working directory first), any
 * file inside node_modules/<name>/ for an ignored package name, or '/' + the resolved file relative to the working
 * directory.
 * @param {Array<string>} ignore
 * @returns {function(string, string): boolean} (id, resolvedFile) => matched
 * @private
 */
const browserifyIgnoreMatcher = (ignore) => {
  const entries = new Set(ignore.map((entry) => entry.startsWith('.') ? path.resolve(entry) : entry))
  return (id, file) => {
    if (entries.has(id) || entries.has(file)) {
      return true
    }
    const packageName = file.replace(/\\/g, '/').split('/node_modules/')[1]?.split('/')[0]
    return entries.has(packageName) || entries.has(`/${path.relative(process.cwd(), file).replace(/\\/g, '/')}`)
  }
}

/**
 * The esbuild plugin that copies what browserify did for module resolution: 'ignore' matches (see
 * browserifyIgnoreMatcher) and unshimmed Node built-ins resolve to an empty object, the built-ins listed in
 * builtinShims resolve to their browser stand-ins, and a free `process` gets the process stand-in injected.
 *
 * Also: browserify read every file as CommonJS, esbuild follows package.json "type". js-build-tools' own dist output
 * is always CommonJS (Babel), even in a `"type": "module"` project, where esbuild would read it as an ES module and
 * leave `exports` undefined. So when commonJsRoot is given, files under it are loaded as CommonJS.
 * @param {Array<string>} ignore
 * @param {string|null} commonJsRoot - absolute dist.to, for a `"type": "module"` project; otherwise null
 * @returns {Object} an esbuild plugin
 * @private
 */
const browserifyCompat = (ignore, commonJsRoot) => ({
  name: 'js-build-tools-browserify-compat',
  setup (build) {
    const isIgnored = browserifyIgnoreMatcher(ignore)
    const emptyModule = (name) => ({ path: name, namespace: emptyNamespace })
    const resolveNormally = (args) => build.resolve(args.path, {
      kind: args.kind,
      resolveDir: args.resolveDir,
      importer: args.importer,
      pluginData: { browserifyCompat: true }
    })

    build.onResolve({ filter: new RegExp(`^${escapeRegExp(processInject)}$`) }, () => ({
      path: 'process',
      namespace: processInjectNamespace
    }))
    build.onLoad({ filter: /.*/, namespace: processInjectNamespace }, () => ({
      contents: `export { default as process } from ${JSON.stringify(processShimImport)}`,
      loader: 'js'
    }))
    // Side-effect free, so a bundle that never reads `process` drops the stand-in entirely
    build.onResolve({ filter: new RegExp(`^${escapeRegExp(processShimImport)}$`) }, () => ({
      path: resolveShim(builtinShims.process),
      sideEffects: false
    }))

    build.onResolve({ filter: /.*/ }, async (args) => {
      if (args.pluginData?.browserifyCompat) {
        return undefined
      }
      if (args.kind !== 'entry-point') {
        if (isIgnored(args.path, '')) {
          return emptyModule(args.path)
        }
        const bareName = args.path.replace(/^node:/, '')
        if (builtins.has(bareName)) {
          if (builtinShims[bareName]) {
            return { path: resolveShim(builtinShims[bareName]) }
          }
          // A project's own installed package of the same name (a browser shim) wins over an empty object
          const installed = args.path.startsWith('node:') ? { errors: [true] } : await resolveNormally(args)
          if (!installed.errors.length) {
            return { path: installed.path }
          }
          // browserify bundled a real shim for some of these (events, buffer, util...); say so instead of failing
          // quietly at runtime. Listing it in browser.ignore makes the empty object deliberate and silences this.
          return {
            ...emptyModule(bareName),
            warnings: [{
              text: `Node built-in "${args.path}" has no browser version, bundled as an empty object (imported by ` +
                `${path.relative(process.cwd(), args.importer)}). Install a browser shim package of the same name, ` +
                'or add it to browser.ignore if this is expected.'
            }]
          }
        }
      }
      if (!ignore.length && !commonJsRoot) {
        return undefined
      }
      const resolved = await resolveNormally(args)
      // Unresolvable or excluded: leave it to esbuild, which reports or externalises it as usual
      if (resolved.errors.length || resolved.external || resolved.namespace !== 'file') {
        return undefined
      }
      if (args.kind !== 'entry-point' && isIgnored(args.path, resolved.path)) {
        return emptyModule(args.path)
      }
      if (commonJsRoot && resolved.path.startsWith(commonJsRoot + path.sep)) {
        return {
          path: path.relative(process.cwd(), resolved.path).replace(/\\/g, '/'),
          namespace: commonJsNamespace,
          pluginData: { file: resolved.path }
        }
      }
      return undefined
    })

    // The project's own dist files, read outside the 'file' namespace so package.json "type" no longer applies
    build.onLoad({ filter: /.*/, namespace: commonJsNamespace }, async ({ pluginData }) => ({
      contents: await readFile(pluginData.file, 'utf8'),
      loader: 'js',
      resolveDir: path.dirname(pluginData.file)
    }))

    build.onLoad({ filter: /.*/, namespace: emptyNamespace }, () => ({ contents: 'module.exports = {}', loader: 'js' }))
  }
})

/**
 * Bundle one entry point with esbuild, returning the bundle as a Vinyl file named `<name>.js`.
 * @param {{name: string, main: string, ignore: Array<string>, exclude: Array<string>}} bundleConfig
 * @returns {Promise<Vinyl>}
 * @private
 */
const buildBundle = async ({ name, main, ignore, exclude }) => {
  // Either setting may be a single string (an ArrayableSetting), as browserify accepted
  const ignoreList = [].concat(ignore || [])
  const excludeList = [].concat(exclude || [])
  const globalName = toGlobalName(name)
  const result = await esbuild.build({
    entryPoints: [createRequire(path.join(process.cwd(), 'package.json')).resolve(path.resolve(main))],
    bundle: true,
    write: false,
    outfile: `${name}.js`,
    platform: 'browser',
    format: 'iife',
    globalName,
    // browserify only read a package's "browser" and "main" fields, never "module"; keep the same builds
    mainFields: ['browser', 'main'],
    external: excludeList,
    define: { global: 'globalThis' },
    inject: [processInject],
    // Also reachable through CommonJS, as browserify's UMD wrapper was (the <script> tag global is unchanged)
    footer: { js: `if (typeof module === 'object' && module && module.exports) { module.exports = ${globalName} }` },
    plugins: [browserifyCompat(ignoreList, commonJsDistRoot())],
    logLevel: 'silent'
  })
  result.warnings.forEach(({ text }) => console.warn(`bundle ${name}.js: ${text}`))
  return new Vinyl({
    cwd: process.cwd(),
    base: process.cwd(),
    path: path.join(process.cwd(), `${name}.js`),
    contents: Buffer.from(result.outputFiles[0].contents)
  })
}

/**
 * Starting at each bundle's own entry point (dist.main for the primary bundle, or its own
 * override from browser.bundles), bundle all the reachable files into a single file per bundle and
 * store them in the specified output directory. A project with no browser.bundles entries gets
 * exactly the one bundle it always did; each additional entry produces its own separate bundle
 * (for example, a render-only variant built from a different entry point than the full bundle).
 *
 * Bundling is done by esbuild (replacing browserify since 6.9.0), as an IIFE. A bundle's name does
 * double duty: it names the output file (name.js) and is also the name its exports are exposed
 * under - as a global when loaded with a bare `<script>` tag (camel-cased the way browserify's
 * `standalone` option did, so `matrix-dom` is `window.matrixDom`), or as the module when required
 * via CommonJS. AMD loaders are no longer supported.
 *
 * Two escape hatches from browser.config.json keep an unwanted dependency (or a dependency's dependency) out of the
 * bundle: 'ignore' replaces it with an empty object (safe when your code never actually calls into it - for example
 * a library's default option value you always override with your own) and 'exclude' leaves it out entirely (your
 * code must not require it, or provide it another way, such as a separate script tag).
 *
 * Node built-ins: `path` and `process` get browser stand-ins, any other built-in resolves to a package of the same
 * name if the project installs one, otherwise to an empty object.
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
export const bundle = () => {
  const files = new PassThrough({ objectMode: true })
  // One shared dest() for every bundle, not one per bundle - vinyl-fs's dest() races against
  // itself (a real "write after end" failure) when two separate dest() streams target the same
  // directory concurrently.
  const output = files.pipe(dest(gulpConfig.get('browser.to')))
  Promise.all(getBundleConfigs().map(buildBundle))
    .then((bundles) => {
      bundles.forEach((file) => files.write(file))
      files.end()
    })
    .catch((error) => output.emit('error', error))
  return output
}
