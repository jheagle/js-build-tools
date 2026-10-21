/* eslint-disable no-template-curly-in-string -- fixture source code, the ${...} is meant to stay literal */
import fs from 'fs'
import * as setUp from './test-helpers/setUp.mjs'
import { lint } from './lint.mjs'
import { sourceLint } from './sourceLint.mjs'
import { countMatches } from 'test-filesystem'

// Run the real neostandard (in a subprocess) - Jest's CommonJS transform can't load the ESM-only package itself.
jest.mock('./partials/neostandardLint.mjs', () => require('./test-helpers/neostandardLintWithRealNeostandard.mjs'))

setUp.setDefaults('test-source-lint')
const gulpConfig = setUp.gulpConfig

const lintableContents = 'const x = "a";\n' +
  '\n' +
  'module.exports = x;\n'

const lintableTestContents = 'const y = "b";\n' +
  '\n' +
  'module.exports = y;\n'

beforeEach(
  () => setUp.beforeEach()
    .then(
      async () => {
        const srcPath = gulpConfig.get('srcPath')
        await fs.mkdirSync(srcPath, { recursive: true })
        fs.writeFileSync(`${srcPath}/example.js`, lintableContents)
        return fs.writeFileSync(`${srcPath}/example.test.js`, lintableTestContents)
      }
    )
)

afterEach(setUp.afterEach)

describe('sourceLint', () => {
  test('fixes the real source in place, including test files', done => {
    const srcPath = gulpConfig.get('srcPath')
    expect.assertions(4)
    sourceLint()
      .on('finish', () => {
        const linted = fs.readFileSync(`${srcPath}/example.js`).toString()
        expect(countMatches(linted, '"')).toEqual(0)
        expect(countMatches(linted, ';')).toEqual(0)
        const lintedTest = fs.readFileSync(`${srcPath}/example.test.js`).toString()
        expect(countMatches(lintedTest, '"')).toEqual(0)
        expect(countMatches(lintedTest, ';')).toEqual(0)
        done()
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done(error)
      })
  }, 20000)

  test('also lints .mjs and .cjs source, not just .js', done => {
    const srcPath = gulpConfig.get('srcPath')
    fs.writeFileSync(`${srcPath}/example.mjs`, 'const m = "d";\n\nexport default m;\n')
    fs.writeFileSync(`${srcPath}/example.cjs`, 'const c = "e";\n\nmodule.exports = c;\n')
    expect.assertions(2)
    sourceLint()
      .on('finish', () => {
        expect(fs.readFileSync(`${srcPath}/example.mjs`).toString()).toEqual('const m = \'d\'\n\nexport default m\n')
        expect(fs.readFileSync(`${srcPath}/example.cjs`).toString()).toEqual('const c = \'e\'\n\nmodule.exports = c\n')
        done()
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done(error)
      })
  }, 20000)

  test('lint.rules actually suppresses a real neostandard finding', done => {
    const srcPath = gulpConfig.get('srcPath')
    // A fixture string containing literal ${...} text (simulating real module source, not an accidental
    // non-template string) - neostandard's no-template-curly-in-string rule flags this as an error by default.
    const fixtureContents = 'const fixture = \'import(`imagemin-${pluginName}`)\'\n\nmodule.exports = fixture\n'
    fs.writeFileSync(`${srcPath}/fixture.js`, fixtureContents)
    gulpConfig.set('lint.rules', { 'no-template-curly-in-string': 'off' })
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    expect.assertions(1)
    sourceLint()
      .on('finish', () => {
        gulpConfig.set('lint.rules', {})
        expect(logSpy.mock.calls.flat().join('\n')).not.toMatch(/no-template-curly-in-string|template string expression/)
        logSpy.mockRestore()
        done()
      })
      .on('error', error => {
        gulpConfig.set('lint.rules', {})
        logSpy.mockRestore()
        console.error('Encountered error', error)
        done(error)
      })
  }, 20000)

  test('also lints .ts source when typescript.enabled', done => {
    const srcPath = gulpConfig.get('srcPath')
    gulpConfig.set('typescript.enabled', true)
    fs.writeFileSync(`${srcPath}/example.ts`, 'const z: string = "c";\n\nexport default z;\n')
    expect.assertions(2)
    sourceLint()
      .on('finish', () => {
        gulpConfig.set('typescript.enabled', false)
        const linted = fs.readFileSync(`${srcPath}/example.ts`).toString()
        expect(countMatches(linted, '"')).toEqual(0)
        expect(countMatches(linted, ';')).toEqual(0)
        done()
      })
      .on('error', error => {
        gulpConfig.set('typescript.enabled', false)
        console.error('Encountered error', error)
        done(error)
      })
  }, 20000)
})

describe('lint', () => {
  test('fixes the source and finishes without error when nothing unfixable remains', done => {
    const srcPath = gulpConfig.get('srcPath')
    expect.assertions(1)
    lint()
      .on('finish', () => {
        expect(countMatches(fs.readFileSync(`${srcPath}/example.js`).toString(), ';')).toEqual(0)
        done()
      })
      .on('error', error => done(error))
  }, 20000)

  test('fails when an error remains that neostandard cannot fix', done => {
    const srcPath = gulpConfig.get('srcPath')
    fs.writeFileSync(`${srcPath}/unfixable.js`, 'const unused = 1\n')
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    expect.assertions(1)
    lint()
      .on('error', error => {
        logSpy.mockRestore()
        expect(error.message).toMatch('neostandard found 1 lint error(s)')
        done()
      })
      .on('finish', () => {
        logSpy.mockRestore()
        done(new Error('lint should have failed on the unused variable'))
      })
  }, 20000)
})
