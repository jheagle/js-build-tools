import fs from 'fs'
import { createRequire } from 'module'
import { transformSync } from '@babel/core'

const require = createRequire(import.meta.url)
const configFile = require.resolve('../babel.config.js')
const babelConfig = require(configFile)

const compile = (code, filename = 'snippet.js') => transformSync(code, { filename, configFile }).code

describe('babel.config.js', () => {
  test('every plugin and preset is a resolved path to a file that exists', () => {
    const entries = [...babelConfig.plugins, ...babelConfig.presets].map((entry) => [].concat(entry)[0])
    expect(entries.length).toBeGreaterThan(0)
    for (const entry of entries) {
      expect(entry.startsWith('/') || /^[A-Za-z]:[\\/]/.test(entry)).toBe(true)
      expect(fs.existsSync(entry)).toBe(true)
    }
  })

  test('compiles ES modules to CommonJS', () => {
    const output = compile('export const answer = 42\nexport default answer\n')
    expect(output).toContain('exports.answer')
    expect(output).toContain('exports.default')
    expect(output).not.toMatch(/^export /m)
  })

  test('injects no polyfills for proposals or iterator helpers, which arrays\' own methods set off', () => {
    // Babel can't tell [].map from an iterator's map, so with iterator helpers in play every array call pulled in
    // core-js Iterator polyfills. Promise.withResolvers / Object.groupBy get none: core-js 3.6 predates them.
    // [].flat() gets none: every pinned target supports it.
    const output = compile('export const a = Promise.withResolvers()\n' +
      'export const b = Object.groupBy([1], x => x)\n' +
      'export const c = [1, 2].map(x => x).filter(Boolean).reduce((sum, x) => sum + x, 0)\n' +
      'export const d = [1, 2].flat()\n')
    expect(output).not.toMatch(/require\("core-js\//)
  })

  test('a WeakMap gets no proposal polyfills', () => {
    // TypeScript compiles a class's #private fields to WeakMaps before Babel sees them (title-switcher); with
    // proposals: true each one added esnext.weak-map.delete-all and ~23KB of core-js
    const output = compile('const counts = new WeakMap()\nexport const count = (key) => counts.get(key) ?? 0\n')
    expect(output).toContain('new WeakMap()')
    expect(output).not.toMatch(/require\("core-js\//)
  })

  test('still injects stable polyfills a target lacks', () => {
    // Array.prototype.includes is stable; core-js still patches it for the pinned targets, so the stable path works
    const output = compile('export const has = [1, 2].includes(2)\n')
    expect(output).toContain('require("core-js/modules/es.array.includes.js")')
  })

  test('compiles TypeScript: types are removed, the code is kept', () => {
    const output = compile('interface Point { x: number }\nexport const origin: Point = { x: 0 }\nexport type Name = string\n', 'snippet.ts')
    expect(output).toContain('exports.origin')
    expect(output).not.toContain('interface')
    expect(output).not.toContain(': Point')
    expect(output).not.toContain('Name')
  })

  test('plain JavaScript compiles exactly as it would without the TypeScript preset', () => {
    const code = 'export const label = (name) => "Hello " + name\n'
    const withoutTypeScript = transformSync(code, {
      filename: 'snippet.js',
      configFile: false,
      plugins: babelConfig.plugins,
      presets: babelConfig.presets.slice(0, -1)
    }).code
    expect(compile(code)).toBe(withoutTypeScript)
  })

  test('compiles import() to an interop require, as Babel 7 did', () => {
    // A native import() of a Babel-compiled CommonJS module would ignore its __esModule marker, so
    // `(await import(x)).default` would be the whole exports object instead of the default export
    const output = compile('export const load = async () => (await import(\'./plugin.js\')).default\n')
    expect(output).toContain('_interopRequireWildcard(require(')
    expect(output).not.toMatch(/[^.\w]import\(/)
  })
})
