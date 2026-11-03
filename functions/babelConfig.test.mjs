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

  test('injects the same core-js polyfills as the Babel 7 config did', () => {
    // Pinned against js-build-tools 7.0.0 (Babel 7, preset-env useBuiltIns: 'usage', corejs 3.6 + proposals), which
    // gives exactly these five for this snippet. Promise.withResolvers / Object.groupBy get none: core-js 3.6 predates
    // them. [].flat() gets none: every pinned target supports it.
    const output = compile('export const a = Promise.withResolvers()\n' +
      'export const b = Object.groupBy([1], x => x)\n' +
      'export const c = [1, 2].values().map(x => x).toArray()\n' +
      'export const d = [1, 2].flat()\n')
    expect(output.match(/require\("core-js\/[^"]+"\)/g)).toEqual([
      'require("core-js/modules/esnext.async-iterator.constructor.js")',
      'require("core-js/modules/esnext.async-iterator.to-array.js")',
      'require("core-js/modules/esnext.iterator.constructor.js")',
      'require("core-js/modules/esnext.iterator.map.js")',
      'require("core-js/modules/esnext.iterator.to-array.js")'
    ])
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
})
