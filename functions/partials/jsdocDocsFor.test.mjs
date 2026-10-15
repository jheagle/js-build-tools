import fs from 'fs'
import path from 'node:path'
import * as setUp from '../test-helpers/setUp.mjs'
import { jsdocDocsFor, resolveJsdocBin, resolveJsdocTheme } from './jsdocDocsFor.mjs'

setUp.setDefaults('test-jsdoc-docs-for')
const gulpConfig = setUp.gulpConfig

const write = (file, contents) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, contents)
}

beforeEach(
  () => setUp.beforeEach().then(() => {
    const srcPath = gulpConfig.get('srcPath')
    write(`${srcPath}/add.js`, '/**\n * Add two numbers.\n * @param {number} a\n * @param {number} b\n * @returns {number}\n */\nconst add = (a, b) => a + b\n\nmodule.exports = add\n')
  })
)

afterEach(setUp.afterEach)

describe('resolveJsdocBin / resolveJsdocTheme', () => {
  test('resolves the real installed jsdoc CLI entry', () => {
    const bin = resolveJsdocBin()
    expect(fs.existsSync(bin)).toBe(true)
    expect(path.basename(bin)).toBe('jsdoc.js')
  })

  test('resolves the real installed theme directory', () => {
    const themeDir = resolveJsdocTheme('clean-jsdoc-theme')
    expect(fs.existsSync(themeDir)).toBe(true)
  })

  test('throws a clear, install-hint error for a package that is not installed', () => {
    expect(() => resolveJsdocTheme('not-a-real-jsdoc-theme-package')).toThrow(/npm install --save-dev/)
  })
})

describe('jsdocDocsFor', () => {
  const fakeRunJsdoc = calls => (bin, args) => {
    calls.bin = bin
    calls.args = args
    calls.config = JSON.parse(fs.readFileSync(args[args.indexOf('-c') + 1], 'utf8'))
    fs.mkdirSync(calls.config.opts.destination, { recursive: true })
    fs.writeFileSync(`${calls.config.opts.destination}/index.html`, '<html></html>')
    return Promise.resolve()
  }

  test('generates the documentation into the output directory, clearing what was there', async () => {
    gulpConfig.set('docs.enabled', true)
    const outPath = `${gulpConfig.get('srcPath')}/../docs`
    write(`${outPath}/stale.html`, 'old')
    const calls = {}
    await jsdocDocsFor(gulpConfig.get('srcPath'), outPath, fakeRunJsdoc(calls))()
    expect(fs.existsSync(`${outPath}/stale.html`)).toBe(false)
    expect(fs.existsSync(`${outPath}/index.html`)).toBe(true)
    expect(calls.config.opts.destination).toBe(path.resolve(outPath))
    expect(calls.config.source.include).toEqual([path.resolve(gulpConfig.get('srcPath'))])
  })

  test('uses the configured theme as the template directory', async () => {
    gulpConfig.set('docs.enabled', true)
    gulpConfig.set('docs.theme', 'clean-jsdoc-theme')
    const calls = {}
    await jsdocDocsFor(gulpConfig.get('srcPath'), `${gulpConfig.get('srcPath')}/../docs`, fakeRunJsdoc(calls))()
    expect(calls.config.opts.template).toBe(resolveJsdocTheme('clean-jsdoc-theme'))
  })

  test('uses the front page from docs.index when it exists, and leaves readme unset when it does not', async () => {
    gulpConfig.set('docs.enabled', true)
    gulpConfig.set('docs.index', `${gulpConfig.get('srcPath')}/../MAIN.md`)
    write(`${gulpConfig.get('srcPath')}/../MAIN.md`, '# hello\n')
    const calls = {}
    await jsdocDocsFor(gulpConfig.get('srcPath'), `${gulpConfig.get('srcPath')}/../docs`, fakeRunJsdoc(calls))()
    expect(calls.config.opts.readme).toBe(path.resolve(`${gulpConfig.get('srcPath')}/../MAIN.md`))

    gulpConfig.set('docs.index', 'does-not-exist.md')
    await jsdocDocsFor(gulpConfig.get('srcPath'), `${gulpConfig.get('srcPath')}/../docs`, fakeRunJsdoc(calls))()
    expect(calls.config.opts.readme).toBeUndefined()
  })

  test('skips if docs.enabled is false', () => {
    gulpConfig.set('docs.enabled', false)
    const result = jsdocDocsFor()
    expect(result).toBeInstanceOf(Function)
    expect(result.length).toBe(0)
  })
})

describe('jsdocDocsFor, end to end with the real jsdoc CLI and clean-jsdoc-theme', () => {
  test('produces a real browsable HTML page from real JSDoc comments', async () => {
    gulpConfig.set('docs.enabled', true)
    const outPath = `${gulpConfig.get('srcPath')}/../docs`
    await jsdocDocsFor(gulpConfig.get('srcPath'), outPath)()
    // clean-jsdoc-theme nests its real output under its own route folders (global/, source/...), not flat at
    // outPath's own root - confirmed by actually running it, not assumed from the classic jsdoc template shape.
    const files = fs.readdirSync(outPath, { recursive: true })
    expect(files.some(file => file.endsWith('.html'))).toBe(true)
  }, 30000)
})
