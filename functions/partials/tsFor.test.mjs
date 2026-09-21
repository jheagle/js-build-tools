import fs from 'fs'
import { Transform, PassThrough } from 'node:stream'
import ts from 'typescript'
import File from 'vinyl'
import * as setUp from '../test-helpers/setUp.mjs'
import { tsFor, loadTypescript } from './tsFor.mjs'
import { countMatches } from 'test-filesystem'

setUp.setDefaults('test-ts-for')
const gulpConfig = setUp.gulpConfig

const rawContents = 'export function sayHello(name: string) {\n' +
  '  return `Hello from ${name}`;\n' +
  '}'

// tsFor's real implementation loads gulp-ts-compile (a genuine ESM-only package) via a dynamic import() hidden
// from babel's static analysis - necessary for production correctness (see tsFor.mjs's own comments), but not
// something this project's current CommonJS-transform-based Jest setup can execute without a much bigger
// migration to Jest's native ESM support. This fake stands in for it here, doing real (not mocked-away)
// TypeScript transpilation via `ts.transpileModule` so this test still exercises genuine compile behavior -
// gulp-ts-compile's own test suite separately covers its whole-program/cross-file-import compile behavior.
const fakeLoadTsCompile = () => Promise.resolve((options) => {
  const transform = new Transform({
    objectMode: true,
    transform (file, enc, callback) {
      const { outputText } = ts.transpileModule(file.contents.toString(), { compilerOptions: options })
      jsStream.push(new File({ cwd: file.cwd, base: file.base, path: file.path.replace(/\.ts$/, '.js'), contents: Buffer.from(outputText) }))
      callback()
    },
    flush (callback) {
      jsStream.end()
      dtsStream.end()
      callback()
    }
  })
  const jsStream = new PassThrough({ objectMode: true })
  const dtsStream = new PassThrough({ objectMode: true })
  transform.js = jsStream
  transform.dts = dtsStream
  return transform
})

beforeEach(
  () => setUp.beforeEach()
    .then(
      async () => {
        const srcPath = gulpConfig.get('srcPath')
        return fs.writeFileSync(`${srcPath}/typeScript.ts`, rawContents)
      }
    )
)

afterEach(setUp.afterEach)

describe('tsFor', () => {
  test('copies the src directory and compiles it into the dist directory', done => {
    gulpConfig.set('typescript.enabled', true)
    const distPath = gulpConfig.get('typescript.to')
    const srcPath = gulpConfig.get('srcPath')
    const srcFile = `${srcPath}/typeScript.ts`
    expect.assertions(3)
    const oldContents = fs.readFileSync(srcFile).toString()
    expect(countMatches(oldContents, 'sayHello(name: string)')).toEqual(1)
    tsFor(srcFile, distPath, fakeLoadTsCompile)(() => {
      expect(fs.existsSync(distPath)).toBeTruthy()
      const compiledContents = fs.readFileSync(`${distPath}/typeScript.js`).toString()
      expect(countMatches(compiledContents, 'sayHello(name)')).toEqual(1)
      done()
    })
  }, 60000)

  test('skips if typescript.enabled is false', () => {
    gulpConfig.set('typescript.enabled', false)
    const result = tsFor()
    expect(result).toBeInstanceOf(Function)
  })
})

describe('loadTypescript', () => {
  test('loads the typescript of the project being built', () => {
    expect(loadTypescript().version).toBe(ts.version)
  })

  test('explains how to install typescript when the project does not have it', () => {
    expect(() => loadTypescript('/')).toThrow(/optional peer dependency typescript.*npm install --save-dev typescript/)
  })
})
