import fs from 'fs'
import * as setUp from '../test-helpers/setUp.mjs'
import { distFor } from './distFor.mjs'
import { countMatches, fileExists } from 'test-filesystem'
import { tsFor } from './tsFor.mjs'

setUp.setDefaults('test-dist-for')
const gulpConfig = setUp.gulpConfig

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

const rawMjsContents = 'import babel from \'gulp-babel\'\n' +
  'import { dest, src } from \'gulp\'\n' +
  'import { distForSrc } from \'./distForSrc.mjs\'\n' +
  'import * as gulpConfig from \'../../gulp.config.mjs\'\n' +
  '\n' +
  '/**\n' +
  ' * Build the distribution for a given source pattern.\n' +
  ' * @memberOf module:partials\n' +
  ' * @param {string|array} [srcPath=\'src/config/path/dist/for\']\n' +
  ' * @param {string} [destPath=\'dist/config/path\']\n' +
  ' * @returns {stream.Stream}\n' +
  ' */\n' +
  'export const distFor = (srcPath = distForSrc(), destPath = gulpConfig.get(\'dist.to\')) => src(srcPath)\n' +
  '  .pipe(babel())\n' +
  '  .pipe((result) => console.log(result) || result)\n' +
  '  .pipe(dest(destPath))\n'

beforeEach(setUp.beforeEach)

afterEach(setUp.afterEach)

describe('distFor', () => {
  test('copies the src directory and babelifies it into the dist directory', done => {
    const srcPath = gulpConfig.get('srcPath')
    const srcFile = `${srcPath}/distFor.js`
    fs.writeFileSync(srcFile, rawContents)
    expect.assertions(5)
    const oldContents = fs.readFileSync(srcFile).toString()
    expect(countMatches(oldContents, 'const ')).toEqual(7)
    const distPath = gulpConfig.get('dist.to')
    distFor(srcFile)
      .on('finish', () => {
        expect(fileExists(distPath)).toBeTruthy()
        const babelifiedContents = fs.readFileSync(`${distPath}/distFor.js`).toString()
        expect(countMatches(babelifiedContents, '"use strict"')).toEqual(1)
        /* There used to be a nice check here where `const` and `let` would be swapped to `var`, but that no longer
           happens.
           It would be nice if it still happened, but due to 'browserlist' supposedly, most browsers support
           `const` and `let` now.
         */
        expect(countMatches(babelifiedContents, 'function')).toEqual(1)
        expect(countMatches(babelifiedContents, 'arguments')).toEqual(6)
        done()
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done()
      })
  }, 5000)

  test('can process typescript before babel', done => {
    const srcPath = gulpConfig.get('srcPath')
    const srcFile = `${srcPath}/distFor.ts`
    fs.writeFileSync(srcFile, rawTsContents)
    expect.assertions(7)
    const oldContents = fs.readFileSync(srcFile).toString()
    expect(countMatches(oldContents, 'const ')).toEqual(3)
    const distPath = gulpConfig.get('dist.to')
    const tsFrom = gulpConfig.get('typescript.from')
    const tsTo = gulpConfig.get('typescript.to')
    tsFor(tsFrom, tsTo)(() => {
      distFor()
        .on('finish', () => {
          expect(fileExists(distPath)).toBeTruthy()
          const babelifiedContents = fs.readFileSync(`${distPath}/distFor.js`).toString()
          expect(countMatches(babelifiedContents, '"use strict"')).toEqual(1)
          expect(countMatches(babelifiedContents, 'const ')).toEqual(0)
          expect(countMatches(babelifiedContents, 'var ')).toEqual(8)
          expect(countMatches(babelifiedContents, 'function')).toEqual(1)
          expect(countMatches(babelifiedContents, 'Object.defineProperty(exports, "__esModule", {')).toEqual(1)
          done()
        })
        .on('error', error => {
          console.error('Encountered error with distFor', error)
          done()
        })
    })
  }, 60000)

  test('converts .mjs file extension to .js', done => {
    const srcPath = gulpConfig.get('srcPath')
    const srcFile = `${srcPath}/distFor.mjs`
    fs.writeFileSync(srcFile, rawMjsContents)
    // expect.assertions(5)
    const oldContents = fs.readFileSync(srcFile).toString()
    expect(countMatches(oldContents, '.mjs')).toEqual(2)
    const distPath = gulpConfig.get('dist.to')
    distFor(srcFile)
      .on('finish', () => {
        expect(fileExists(distPath)).toBeTruthy()
        const babelifiedContents = fs.readFileSync(`${distPath}/distFor.js`).toString()
        expect(countMatches(babelifiedContents, '.js')).toEqual(3)
        done()
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done()
      })
  }, 5000)
})
