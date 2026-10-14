import fs from 'fs'
import * as setUp from './test-helpers/setUp.mjs'
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
