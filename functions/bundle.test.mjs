import { createRequire } from 'module'
import { jest } from '@jest/globals'
import fs from 'fs'
import path from 'path'
import * as setUp from './test-helpers/setUp.mjs'
import { bundle, toGlobalName } from './bundle.mjs'
import vm from 'vm'
import { countMatches } from 'test-filesystem'

const require = createRequire(import.meta.url)
setUp.setDefaults('test-bundle')
const gulpConfig = setUp.gulpConfig

const file1Contents = 'function file1 () {\n' +
  '  console.log(\'Hello from file1\')\n' +
  '}\n' +
  '\n' +
  'module.exports = file1\n'
const file2Contents = 'function file2 () {\n' +
  '  console.log(\'Good-bye from file2\')\n' +
  '}\n' +
  '\n' +
  'module.exports = file2\n'
const mainFileContents = 'const file1 = require(\'./sources/file1\')\n' +
  'const file2 = require(\'./sources/file2\')\n' +
  '\n' +
  'module.exports = {\n' +
  '  file1,\n' +
  '  file2,\n' +
  '}\n'

beforeEach(
  () => setUp.beforeEach()
    .then(
      async () => {
        const distPath = gulpConfig.get('dist.to')
        const mainFile = gulpConfig.get('dist.main')
        const sourcesPath = `${distPath}/sources`
        await fs.mkdirSync(distPath)
        await fs.mkdirSync(sourcesPath)
        await fs.writeFileSync(`${sourcesPath}/file1.js`, file1Contents)
        await fs.writeFileSync(`${sourcesPath}/file2.js`, file2Contents)
        return fs.writeFileSync(`${mainFile}.js`, mainFileContents)
      }
    )
)

afterEach(setUp.afterEach)

describe('bundle', () => {
  test('copies all the dist contents into a single file for browsers', done => {
    const destFile = `${gulpConfig.get('browser.name')}.js`
    const destPath = gulpConfig.get('browser.to')
    const bundledFile = `${destPath}/${destFile}`
    expect.assertions(2)
    bundle()
      .on('finish', () => {
        // esbuild re-indents each module inside its own wrapper, so look for each module's code, not its exact text
        const bundledContents = fs.readFileSync(bundledFile).toString()
        expect(countMatches(bundledContents, 'console.log("Hello from file1")')).toEqual(1)
        expect(countMatches(bundledContents, 'console.log("Good-bye from file2")')).toEqual(1)
        done()
      })
      .on('error', error => done(error))
  })

  test('exposes browser.name as the standalone export, reachable by a real consumer', done => {
    const destPath = gulpConfig.get('browser.to')
    const bundledFile = `${destPath}/${gulpConfig.get('browser.name')}.js`
    expect.assertions(2)
    bundle()
      .on('finish', () => {
        // A UMD bundle (browserify's `standalone` option) resolves to its CommonJS branch when
        // required like this, and to a `window.<browser.name>` global when loaded via a bare
        // <script> tag in a real browser - both paths hit the same exported value.
        const resolved = path.resolve(bundledFile)
        delete require.cache[resolved]
        const loaded = require(resolved)
        expect(typeof loaded.file1).toBe('function')
        expect(typeof loaded.file2).toBe('function')
        done()
      })
      .on('error', error => done(error))
  })
})

describe('bundle with additional bundles', () => {
  const renderOnlyFileContents = 'const file1 = require(\'./sources/file1\')\n' +
    '\n' +
    'module.exports = {\n' +
    '  file1,\n' +
    '}\n'

  afterEach(() => gulpConfig.set('browser.bundles', []))

  test('produces one file per additional bundle, each from its own entry point', done => {
    const distPath = gulpConfig.get('dist.to')
    const renderOnlyMain = `${distPath}/renderOnly`
    fs.writeFileSync(`${renderOnlyMain}.js`, renderOnlyFileContents)
    gulpConfig.set('browser.bundles', [{ name: 'renderOnly', main: renderOnlyMain }])

    const destPath = gulpConfig.get('browser.to')
    const primaryFile = `${destPath}/${gulpConfig.get('browser.name')}.js`
    const renderOnlyFile = `${destPath}/renderOnly.js`
    expect.assertions(4)
    bundle()
      .on('finish', () => {
        // The primary bundle is unaffected - still built from dist.main, still has both files.
        const primaryContents = fs.readFileSync(primaryFile).toString()
        expect(primaryContents).toContain('Hello from file1')
        expect(primaryContents).toContain('Good-bye from file2')

        // The additional bundle came from its own entry point - file1 only, never file2.
        const renderOnlyContents = fs.readFileSync(renderOnlyFile).toString()
        expect(renderOnlyContents).toContain('Hello from file1')
        expect(renderOnlyContents).not.toContain('Good-bye from file2')
        done()
      })
      .on('error', error => done(error))
  })

  test('an additional bundle exposes its own name as its standalone export', done => {
    const distPath = gulpConfig.get('dist.to')
    const renderOnlyMain = `${distPath}/renderOnly`
    fs.writeFileSync(`${renderOnlyMain}.js`, renderOnlyFileContents)
    gulpConfig.set('browser.bundles', [{ name: 'renderOnly', main: renderOnlyMain }])

    const destPath = gulpConfig.get('browser.to')
    const renderOnlyFile = `${destPath}/renderOnly.js`
    expect.assertions(2)
    bundle()
      .on('finish', () => {
        const resolved = path.resolve(renderOnlyFile)
        delete require.cache[resolved]
        const loaded = require(resolved)
        expect(typeof loaded.file1).toBe('function')
        expect(loaded.file2).toBeUndefined()
        done()
      })
      .on('error', error => done(error))
  })
})

describe('bundle ignore / exclude', () => {
  const optionalDepMarker = 'MARKER_FROM_THE_OPTIONAL_DEPENDENCY_CODE'

  beforeEach(() => {
    const tempDir = gulpConfig.get('rootPath')
    const depDir = `${tempDir}node_modules/optional-dep`
    fs.mkdirSync(depDir, { recursive: true })
    fs.writeFileSync(`${depDir}/package.json`, JSON.stringify({ name: 'optional-dep', main: 'index.js' }))
    fs.writeFileSync(`${depDir}/index.js`, `module.exports = '${optionalDepMarker}'\n`)
    const distPath = gulpConfig.get('dist.to')
    const mainFile = gulpConfig.get('dist.main')
    fs.mkdirSync(distPath, { recursive: true })
    // Only reached as a fallback for an option the caller always overrides, the way css-select falls back to its
    // own default adapter (domutils) unless one is given - exactly the case ignore / exclude exist for.
    fs.writeFileSync(`${mainFile}.js`, 'const optionalDep = require(\'optional-dep\')\n\nmodule.exports = (given) => given || optionalDep\n')
  })

  test('without ignore or exclude, the dependency is bundled', done => {
    const destPath = gulpConfig.get('browser.to')
    const bundledFile = `${destPath}/${gulpConfig.get('browser.name')}.js`
    expect.assertions(1)
    bundle()
      .on('finish', () => {
        expect(fs.readFileSync(bundledFile).toString()).toContain(optionalDepMarker)
        done()
      })
      .on('error', error => done(error))
  })

  test('ignore replaces the dependency with an empty object, but the bundle still finishes', done => {
    gulpConfig.set('browser.ignore', ['optional-dep'])
    const destPath = gulpConfig.get('browser.to')
    const bundledFile = `${destPath}/${gulpConfig.get('browser.name')}.js`
    expect.assertions(2)
    bundle()
      .on('finish', () => {
        const bundledContents = fs.readFileSync(bundledFile).toString()
        // The ignored module is still in the bundle (as an empty stub, so requiring it by name still resolves) -
        // it just no longer has the real code that would have pulled in the marker
        expect(bundledContents).toContain('optional-dep')
        expect(bundledContents).not.toContain(optionalDepMarker)
        done()
      })
      .on('error', error => done(error))
  })

  test('exclude leaves the dependency out of the bundle entirely', done => {
    gulpConfig.set('browser.exclude', ['optional-dep'])
    const destPath = gulpConfig.get('browser.to')
    const bundledFile = `${destPath}/${gulpConfig.get('browser.name')}.js`
    expect.assertions(1)
    bundle()
      .on('finish', () => {
        expect(fs.readFileSync(bundledFile).toString()).not.toContain(optionalDepMarker)
        done()
      })
      .on('error', error => done(error))
  })

  test('a single string is accepted the same as a one item array', done => {
    gulpConfig.set('browser.ignore', 'optional-dep')
    const destPath = gulpConfig.get('browser.to')
    const bundledFile = `${destPath}/${gulpConfig.get('browser.name')}.js`
    expect.assertions(1)
    bundle()
      .on('finish', () => {
        expect(fs.readFileSync(bundledFile).toString()).not.toContain(optionalDepMarker)
        done()
      })
      .on('error', error => done(error))
  })
})

describe('bundle as a browser script', () => {
  const runAsScript = (file) => {
    // A bare <script> tag: no module, no require, no process, no global - only the window (globalThis)
    const context = vm.createContext({})
    vm.runInContext(fs.readFileSync(file).toString(), context)
    return context
  }

  const originalName = gulpConfig.get('browser.name')

  afterEach(() => gulpConfig.set('browser.name', originalName))

  test('exposes the bundle as a global, camel-cased the way browserify standalone did', done => {
    gulpConfig.set('browser.name', 'my-bundle')
    const bundledFile = `${gulpConfig.get('browser.to')}/my-bundle.js`
    expect.assertions(2)
    bundle()
      .on('finish', () => {
        const context = runAsScript(bundledFile)
        expect(typeof context.myBundle.file1).toBe('function')
        expect(typeof context.myBundle.file2).toBe('function')
        done()
      })
      .on('error', error => done(error))
  })

  test('Node built-ins: path gets a browser stand-in, fs an empty object, process and global still work', done => {
    fs.writeFileSync(`${gulpConfig.get('dist.main')}.js`, 'const path = require(\'path\')\n' +
      'const fs = require(\'fs\')\n' +
      'module.exports = {\n' +
      '  joined: path.join(\'a\', \'b\', \'..\', \'c\'),\n' +
      '  fsKeys: Object.keys(fs).length,\n' +
      '  env: typeof process !== \'undefined\' && process.env,\n' +
      '  isGlobal: global === globalThis\n' +
      '}\n')
    const bundledFile = `${gulpConfig.get('browser.to')}/${gulpConfig.get('browser.name')}.js`
    // fs has no browser version, so it warns; that warning has its own test below
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const finish = (error) => {
      warn.mockRestore()
      done(error)
    }
    expect.assertions(4)
    bundle()
      .on('finish', () => {
        try {
          const context = runAsScript(bundledFile)
          const loaded = context[toGlobalName(originalName)]
          expect(loaded.joined).toBe('a/c')
          expect(loaded.fsKeys).toBe(0)
          expect(loaded.env).toEqual({})
          expect(loaded.isGlobal).toBe(true)
          finish()
        } catch (error) {
          finish(error)
        }
      })
      .on('error', finish)
  })

  test('a built-in that becomes an empty object is reported, unless it is listed in ignore', done => {
    fs.writeFileSync(`${gulpConfig.get('dist.main')}.js`, 'module.exports = { fs: require(\'fs\'), os: require(\'os\') }\n')
    gulpConfig.set('browser.ignore', ['fs'])
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const finish = (error) => {
      warn.mockRestore()
      gulpConfig.set('browser.ignore', [])
      done(error)
    }
    expect.assertions(2)
    bundle()
      .on('finish', () => {
        try {
          const messages = warn.mock.calls.map(([message]) => message)
          expect(messages).toEqual([expect.stringContaining('Node built-in "os" has no browser version')])
          expect(messages.join('')).not.toContain('"fs"')
          finish()
        } catch (error) {
          finish(error)
        }
      })
      .on('error', finish)
  })

  test('a bundle that never uses process does not get the process stand-in', done => {
    const bundledFile = `${gulpConfig.get('browser.to')}/${gulpConfig.get('browser.name')}.js`
    expect.assertions(1)
    bundle()
      .on('finish', () => {
        expect(fs.readFileSync(bundledFile).toString()).not.toContain('nextTick')
        done()
      })
      .on('error', error => done(error))
  })

  test('a build failure is emitted as an error on the returned stream', done => {
    fs.writeFileSync(`${gulpConfig.get('dist.main')}.js`, 'module.exports = require(\'./does-not-exist\')\n')
    expect.assertions(1)
    bundle()
      .on('finish', () => done(new Error('should not finish')))
      .on('error', error => {
        expect(error.message).toContain('does-not-exist')
        done()
      })
  })
})

describe('bundle ignore by file path', () => {
  test('a file path without its extension does not match, as with browserify', done => {
    const distPath = gulpConfig.get('dist.to')
    gulpConfig.set('browser.ignore', [`./${distPath}/sources/file2`])
    const bundledFile = `${gulpConfig.get('browser.to')}/${gulpConfig.get('browser.name')}.js`
    expect.assertions(1)
    bundle()
      .on('finish', () => {
        gulpConfig.set('browser.ignore', [])
        expect(fs.readFileSync(bundledFile).toString()).toContain('Good-bye from file2')
        done()
      })
      .on('error', error => {
        gulpConfig.set('browser.ignore', [])
        done(error)
      })
  })

  test.each([
    ['relative, starting with ./', (distPath) => `./${distPath}/sources/file2.js`],
    ['absolute', (distPath) => path.resolve(`${distPath}/sources/file2.js`)],
    ['/ + relative to the working directory', (distPath) => `/${distPath}/sources/file2.js`]
  ])('ignore also accepts a file path: %s', (_, toEntry, done) => {
    const distPath = gulpConfig.get('dist.to')
    gulpConfig.set('browser.ignore', [toEntry(distPath)])
    const bundledFile = `${gulpConfig.get('browser.to')}/${gulpConfig.get('browser.name')}.js`
    expect.assertions(2)
    bundle()
      .on('finish', () => {
        gulpConfig.set('browser.ignore', [])
        const contents = fs.readFileSync(bundledFile).toString()
        expect(contents).toContain('Hello from file1')
        expect(contents).not.toContain('Good-bye from file2')
        done()
      })
      .on('error', error => {
        gulpConfig.set('browser.ignore', [])
        done(error)
      })
  })
})

describe('toGlobalName', () => {
  test.each([
    ['jsonDom', 'jsonDom'],
    ['matrix-dom', 'matrixDom'],
    ['pseudo-dom', 'pseudoDom'],
    ['collect-your-stuff', 'collectYourStuff'],
    ['my.name-space', 'my.nameSpace']
  ])('%s -> %s', (name, expected) => {
    expect(toGlobalName(name)).toBe(expected)
  })

  test('throws when nothing valid is left', () => {
    expect(() => toGlobalName('---')).toThrow('valid JavaScript identifier')
  })
})

describe('bundle ignore by package name', () => {
  test('ignoring a package name also empties a deep import from inside that package', done => {
    const tempDir = gulpConfig.get('rootPath')
    const depDir = `${tempDir}node_modules/deep-dep`
    fs.mkdirSync(`${depDir}/lib`, { recursive: true })
    fs.writeFileSync(`${depDir}/package.json`, JSON.stringify({ name: 'deep-dep', main: 'index.js' }))
    fs.writeFileSync(`${depDir}/lib/inner.js`, 'module.exports = \'DEEP_DEP_INNER_MARKER\'\n')
    fs.writeFileSync(`${gulpConfig.get('dist.main')}.js`, 'module.exports = require(\'deep-dep/lib/inner\')\n')
    gulpConfig.set('browser.ignore', ['deep-dep'])
    const bundledFile = `${gulpConfig.get('browser.to')}/${gulpConfig.get('browser.name')}.js`
    expect.assertions(1)
    bundle()
      .on('finish', () => {
        gulpConfig.set('browser.ignore', [])
        expect(fs.readFileSync(bundledFile).toString()).not.toContain('DEEP_DEP_INNER_MARKER')
        done()
      })
      .on('error', error => {
        gulpConfig.set('browser.ignore', [])
        done(error)
      })
  })
})

describe('bundle in a "type": "module" package', () => {
  const packageFile = () => `${gulpConfig.get('rootPath')}package.json`

  afterEach(() => fs.rmSync(packageFile(), { force: true }))

  test('the Babel-compiled (CommonJS) dist files still bundle as CommonJS', done => {
    fs.writeFileSync(packageFile(), JSON.stringify({ name: 'esm-app', type: 'module' }))
    const distPath = gulpConfig.get('dist.to')
    fs.writeFileSync(`${distPath}/sources/esModuleFlag.js`, '"use strict";\n' +
      'Object.defineProperty(exports, "__esModule", { value: true });\n' +
      'exports.flag = void 0;\n' +
      'var flag = exports.flag = \'babel-cjs\';\n')
    fs.writeFileSync(`${gulpConfig.get('dist.main')}.js`, '"use strict";\n' +
      'var _flag = require("./sources/esModuleFlag.js");\n' +
      'exports.flag = _flag.flag;\n' +
      'exports.file1 = require("./sources/file1");\n')
    const bundledFile = `${gulpConfig.get('browser.to')}/${gulpConfig.get('browser.name')}.js`
    expect.assertions(3)
    bundle()
      .on('finish', () => {
        const contents = fs.readFileSync(bundledFile).toString()
        const context = vm.createContext({})
        vm.runInContext(contents, context)
        const loaded = context[toGlobalName(gulpConfig.get('browser.name'))]
        expect(loaded.flag).toBe('babel-cjs')
        expect(typeof loaded.file1).toBe('function')
        // Paths in the bundle stay relative, never the machine's absolute path
        expect(contents).not.toContain(path.resolve(distPath))
        done()
      })
      .on('error', error => done(error))
  })
})

describe('bundle exclude on Node built-ins', () => {
  afterEach(() => gulpConfig.set('browser.exclude', []))

  test('an excluded built-in is left out (required at runtime), not shimmed or emptied', done => {
    fs.writeFileSync(`${gulpConfig.get('dist.main')}.js`, 'module.exports = () => [require(\'events\'), require(\'path\')]\n')
    gulpConfig.set('browser.exclude', ['events', 'path'])
    const bundledFile = `${gulpConfig.get('browser.to')}/${gulpConfig.get('browser.name')}.js`
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const finish = (error) => {
      warn.mockRestore()
      done(error)
    }
    expect.assertions(3)
    bundle()
      .on('finish', () => {
        try {
          const contents = fs.readFileSync(bundledFile).toString()
          // Left as runtime requires: no path-browserify code, no empty stand-in, and nothing to warn about
          expect(contents).not.toContain('path-browserify')
          expect(contents).not.toContain('js-build-tools-empty')
          expect(warn).not.toHaveBeenCalled()
          finish()
        } catch (error) {
          finish(error)
        }
      })
      .on('error', finish)
  })
})

describe('bundle ignore with a scoped package', () => {
  afterEach(() => gulpConfig.set('browser.ignore', []))

  test.each([
    ['the package', '@scoped/dep'],
    ['the whole scope (browserify\'s own rule)', '@scoped']
  ])('ignoring %s also empties a deep import from inside it', (_, entry, done) => {
    const depDir = `${gulpConfig.get('rootPath')}node_modules/@scoped/dep`
    fs.mkdirSync(`${depDir}/lib`, { recursive: true })
    fs.writeFileSync(`${depDir}/package.json`, JSON.stringify({ name: '@scoped/dep', main: 'index.js' }))
    fs.writeFileSync(`${depDir}/lib/inner.js`, 'module.exports = \'SCOPED_DEP_INNER_MARKER\'\n')
    fs.writeFileSync(`${gulpConfig.get('dist.main')}.js`, 'module.exports = require(\'@scoped/dep/lib/inner\')\n')
    gulpConfig.set('browser.ignore', [entry])
    const bundledFile = `${gulpConfig.get('browser.to')}/${gulpConfig.get('browser.name')}.js`
    expect.assertions(1)
    bundle()
      .on('finish', () => {
        try {
          expect(fs.readFileSync(bundledFile).toString()).not.toContain('SCOPED_DEP_INNER_MARKER')
          done()
        } catch (error) {
          done(error)
        }
      })
      .on('error', error => done(error))
  })
})

describe('bundle with a dependency whose "browser" field disables Node built-ins', () => {
  test('fs, util and path set to false give empty objects, with no warning and no stand-in', done => {
    const depDir = `${gulpConfig.get('rootPath')}node_modules/browser-field-dep`
    fs.mkdirSync(depDir, { recursive: true })
    // The shape postcss and readable-stream use
    fs.writeFileSync(`${depDir}/package.json`, JSON.stringify({
      name: 'browser-field-dep', main: 'index.js', browser: { fs: false, util: false, path: false }
    }))
    fs.writeFileSync(`${depDir}/index.js`, 'module.exports = {\n' +
      '  fsKeys: Object.keys(require(\'fs\')).length,\n' +
      '  utilKeys: Object.keys(require(\'util\')).length,\n' +
      '  pathKeys: Object.keys(require(\'path\')).length\n' +
      '}\n')
    fs.writeFileSync(`${gulpConfig.get('dist.main')}.js`, 'module.exports = require(\'browser-field-dep\')\n')
    const bundledFile = `${gulpConfig.get('browser.to')}/${gulpConfig.get('browser.name')}.js`
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const finish = (error) => {
      warn.mockRestore()
      done(error)
    }
    expect.assertions(3)
    bundle()
      .on('finish', () => {
        try {
          const context = vm.createContext({})
          vm.runInContext(fs.readFileSync(bundledFile).toString(), context)
          expect(context[toGlobalName(gulpConfig.get('browser.name'))]).toEqual({ fsKeys: 0, utilKeys: 0, pathKeys: 0 })
          expect(fs.readFileSync(bundledFile).toString()).not.toContain('path-browserify')
          expect(warn).not.toHaveBeenCalled()
          finish()
        } catch (error) {
          finish(error)
        }
      })
      .on('error', finish)
  })

  test('one package disabling path leaves another package\'s require(\'path\') on the stand-in', done => {
    const modules = `${gulpConfig.get('rootPath')}node_modules`
    fs.mkdirSync(`${modules}/disables-path`, { recursive: true })
    fs.writeFileSync(`${modules}/disables-path/package.json`, JSON.stringify({ name: 'disables-path', main: 'index.js', browser: { path: false } }))
    fs.writeFileSync(`${modules}/disables-path/index.js`, 'module.exports = Object.keys(require(\'path\')).length\n')
    fs.mkdirSync(`${modules}/uses-path`, { recursive: true })
    fs.writeFileSync(`${modules}/uses-path/package.json`, JSON.stringify({ name: 'uses-path', main: 'index.js' }))
    fs.writeFileSync(`${modules}/uses-path/index.js`, 'module.exports = require(\'path\').join(\'a\', \'..\', \'b\')\n')
    fs.writeFileSync(`${gulpConfig.get('dist.main')}.js`, 'module.exports = { disabled: require(\'disables-path\'), joined: require(\'uses-path\') }\n')
    const bundledFile = `${gulpConfig.get('browser.to')}/${gulpConfig.get('browser.name')}.js`
    expect.assertions(1)
    bundle()
      .on('finish', () => {
        try {
          const context = vm.createContext({})
          vm.runInContext(fs.readFileSync(bundledFile).toString(), context)
          expect(context[toGlobalName(gulpConfig.get('browser.name'))]).toEqual({ disabled: 0, joined: 'b' })
          done()
        } catch (error) {
          done(error)
        }
      })
      .on('error', error => done(error))
  })
})
