const fs = require('fs')
const setUp = require('../test-helpers/setUp')
setUp.setDefaults('test-dist-for')
const gulpConfig = setUp.gulpConfig
const distFor = require('./distFor')
const { countMatches } = require('../testHelpers')
const typeScript = require('../typeScript')

const rawContents = 'const babel = require(\'gulp-babel\')\n' +
  'const { dest, src } = require(\'gulp\')\n' +
  'const typeScript = require(\'./typeScript\')\n' +
  'const gulpConfig = require(\'../gulp.config.js\')\n' +
  '\n' +
  'const useTsConfig = gulpConfig.get(\'useTsConfig\')\n' +
  '\n' +
  'const defaultSrc = useTsConfig\n' +
  '  ? gulpConfig.get(\'distSearch\')\n' +
  '  : gulpConfig.get(\'srcSearch\')\n' +
  '\n' +
  'const distFor = (srcPath = defaultSrc, destPath = gulpConfig.get(\'distPath\')) => {\n' +
  '  let pipedSrc = src(srcPath)\n' +
  '  if (useTsConfig) {\n' +
  '    // Add the typescript so we can compile then apply babel to those files\n' +
  '    pipedSrc = typeScript(pipedSrc)\n' +
  '  }\n' +
  '  return pipedSrc\n' +
  '    .pipe(babel())\n' +
  '    .pipe(dest(destPath))\n' +
  '}\n' +
  '\n' +
  'module.exports = distFor\n'

const rawTsContents = '// @ts-ignore\n' +
  'import gulpConfig from \'../gulp.config.js\'\n' +
  '// @ts-ignore\n' +
  'import typeScript from \'./typeScript.js\'\n' +
  '// @ts-ignore\n' +
  'import {dest, src} from \'gulp\'\n' +
  '// @ts-ignore\n' +
  'import babel from \'gulp-babel\'\n' +
  '\n' +
  'const useTsConfig = gulpConfig.get(\'useTsConfig\')\n' +
  '\n' +
  'const defaultSrc: string | Array<any> = useTsConfig\n' +
  '    ? gulpConfig.get(\'distSearch\')\n' +
  '    : gulpConfig.get(\'srcSearch\')\n' +
  '\n' +
  '// @ts-ignore\n' +
  'const distFor = (srcPath: string | Array<any> = defaultSrc, destPath: string = gulpConfig.get(\'distPath\')): import(\'readable-stream\').Stream => {\n' +
  '    let pipedSrc = src(srcPath)\n' +
  '    if (useTsConfig) {\n' +
  '        // Add the typescript so we can compile then apply babel to those files\n' +
  '        pipedSrc = typeScript(pipedSrc)\n' +
  '    }\n' +
  '    return pipedSrc\n' +
  '        .pipe(babel())\n' +
  '        .pipe(dest(destPath))\n' +
  '}\n' +
  '\n' +
  'export default distFor\n'

beforeEach(setUp.beforeEach)

afterEach(setUp.afterEach)

describe('distFor', () => {
  test('copies the src directory and babelifies it into the dist directory', done => {
    const srcPath = gulpConfig.get('srcPath')
    const srcFile = `${srcPath}/distFor.js`
    fs.writeFileSync(srcFile, rawContents)
    expect.assertions(7)
    const oldContents = fs.readFileSync(srcFile).toString()
    expect(countMatches(oldContents, 'const ')).toEqual(7)
    const distPath = gulpConfig.get('distPath')
    distFor(srcFile)
      .on('finish', () => {
        expect(fs.existsSync(distPath)).toBeTruthy()
        const babelifiedContents = fs.readFileSync(`${distPath}/distFor.js`).toString()
        expect(countMatches(babelifiedContents, '"use strict"')).toEqual(1)
        // If the below assertion fails it is because 'const' no longer is replaced with 'var'
        // To fix, change `.browserslistrc` set `> 0.24%` to a lower number. For example, last fix changed from `> 0.25%`
        expect(countMatches(babelifiedContents, 'const ')).toEqual(0)
        expect(countMatches(babelifiedContents, 'var ')).toEqual(10)
        expect(countMatches(babelifiedContents, 'function')).toEqual(1)
        expect(countMatches(babelifiedContents, 'arguments')).toEqual(6)
        done()
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done()
      })
  })

  test('can process typescript before babel', done => {
    const srcPath = gulpConfig.get('srcPath')
    const srcFile = `${srcPath}/distFor.ts`
    fs.writeFileSync(srcFile, rawTsContents)
    expect.assertions(7)
    const oldContents = fs.readFileSync(srcFile).toString()
    expect(countMatches(oldContents, 'const ')).toEqual(3)
    const distPath = gulpConfig.get('distPath')
    typeScript()
      .on('finish', () => {
        distFor()
          .on('finish', () => {
            expect(fs.existsSync(distPath)).toBeTruthy()
            const babelifiedContents = fs.readFileSync(`${distPath}/distFor.js`).toString()
            expect(countMatches(babelifiedContents, '"use strict"')).toEqual(1)
            expect(countMatches(babelifiedContents, 'const ')).toEqual(0)
            expect(countMatches(babelifiedContents, 'var ')).toEqual(8)
            expect(countMatches(babelifiedContents, 'function')).toEqual(1)
            expect(countMatches(babelifiedContents, 'Object.defineProperty(exports, "__esModule", { value: true })')).toEqual(1)
            done()
          })
          .on('error', error => {
            console.error('Encountered error with distFor', error)
            done()
          })
      })
      .on('error', error => {
        console.error('Encountered error with typeScript', error)
        done()
      })
  }, 30000)
})
