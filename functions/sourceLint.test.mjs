import { jest } from '@jest/globals'
/* eslint-disable no-template-curly-in-string -- fixture source code, the ${...} is meant to stay literal */
import fs from 'fs'
import * as setUp from './test-helpers/setUp.mjs'
import { countMatches } from 'test-filesystem'

// Run the real neostandard (in a subprocess) - Jest's CommonJS transform can't load the ESM-only package itself.
jest.unstable_mockModule('./partials/neostandardLint.mjs', () => import('./test-helpers/neostandardLintWithRealNeostandard.mjs'))

const { lint } = await import('./lint.mjs')
const { sourceLint } = await import('./sourceLint.mjs')

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

  describe('lint.include', () => {
    const tempDir = () => gulpConfig.get('srcPath').replace(/src$/, '')
    afterEach(() => gulpConfig.set('lint.include', []))

    test('lints and fixes extra folders outside srcPath, in place', done => {
      const scripts = `${tempDir()}scripts`
      fs.mkdirSync(`${scripts}/e2e`, { recursive: true })
      fs.writeFileSync(`${scripts}/e2e/driver.mjs`, 'const d = "f";\n\nexport default d;\n')
      gulpConfig.set('lint.include', [scripts])
      expect.assertions(2)
      sourceLint()
        .on('finish', () => {
          expect(fs.readFileSync(`${scripts}/e2e/driver.mjs`).toString()).toEqual('const d = \'f\'\n\nexport default d\n')
          // srcPath is still linted alongside it
          expect(countMatches(fs.readFileSync(`${gulpConfig.get('srcPath')}/example.js`).toString(), ';')).toEqual(0)
          done()
        })
        .on('error', error => done(error))
    }, 20000)

    test('accepts a single folder as a string, with a trailing slash', done => {
      const scripts = `${tempDir()}scripts`
      fs.mkdirSync(scripts, { recursive: true })
      fs.writeFileSync(`${scripts}/tool.cjs`, 'const t = "g";\n\nmodule.exports = t;\n')
      gulpConfig.set('lint.include', `${scripts}/`)
      expect.assertions(1)
      sourceLint()
        .on('finish', () => {
          expect(fs.readFileSync(`${scripts}/tool.cjs`).toString()).toEqual('const t = \'g\'\n\nmodule.exports = t\n')
          done()
        })
        .on('error', error => done(error))
    }, 20000)

    test('never lints node_modules inside an included folder', done => {
      const scripts = `${tempDir()}scripts`
      const vendored = `${scripts}/node_modules/dep/index.js`
      const vendoredContents = 'const v = "h";\n\nmodule.exports = v;\n'
      fs.mkdirSync(`${scripts}/node_modules/dep`, { recursive: true })
      fs.writeFileSync(vendored, vendoredContents)
      gulpConfig.set('lint.include', [scripts])
      expect.assertions(1)
      sourceLint()
        .on('finish', () => {
          expect(fs.readFileSync(vendored).toString()).toEqual(vendoredContents)
          done()
        })
        .on('error', error => done(error))
    }, 20000)

    test('lint fails on an unfixable error in an included folder', done => {
      const scripts = `${tempDir()}scripts`
      fs.mkdirSync(scripts, { recursive: true })
      fs.writeFileSync(`${scripts}/unfixable.js`, 'const unused = 1\n')
      gulpConfig.set('lint.include', [scripts])
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
          done(new Error('lint should have failed on the unused variable in the included folder'))
        })
    }, 20000)
  })

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

  test('only fails once every fixed file has been written back', done => {
    // gulp exits as soon as a task fails, so failing while a file is still being written can leave that file empty.
    const srcPath = gulpConfig.get('srcPath')
    const fixable = ['a', 'b', 'c'].map(name => `${srcPath}/fixable-${name}.js`)
    fixable.forEach(file => fs.writeFileSync(file, 'const x = "y";\n\nmodule.exports = x;\n'))
    fs.writeFileSync(`${srcPath}/unfixable.js`, 'const unused = 1\n')
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    expect.assertions(fixable.length)
    lint()
      .on('error', () => {
        logSpy.mockRestore()
        fixable.forEach(file => expect(fs.readFileSync(file).toString()).toEqual('const x = \'y\'\n\nmodule.exports = x\n'))
        done()
      })
      .on('finish', () => {
        logSpy.mockRestore()
        done(new Error('lint should have failed on the unused variable'))
      })
  }, 30000)
})
