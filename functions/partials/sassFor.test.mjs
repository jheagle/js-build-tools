import { createRequire } from 'module'
import fs from 'fs'
import * as setUp from '../test-helpers/setUp.mjs'
import { sassFor } from './sassFor.mjs'
import { countMatches } from 'test-filesystem'

setUp.setDefaults('test-sass-for')
const gulpConfig = setUp.gulpConfig

const sassContents = 'html\n' +
  '  font-size: 62.5%\n' +
  '  color: #444\n' +
  '  font-size: 1em\n' +
  '  line-height: 1.4\n' +
  '  background-color: #fff\n' +
  '\n' +
  'html, body\n' +
  '  width: 100%\n' +
  '  height: 100%\n' +
  '  margin: 0\n' +
  '  padding: 0\n' +
  '  position: absolute\n' +
  '  text-align: center\n' +
  '\n' +
  'a\n' +
  '  outline: none\n' +
  '  text-decoration: none'

const sassPath = gulpConfig.get('sass.path')

beforeEach(() => setUp.beforeEach().then(() => fs.mkdirSync(sassPath, { recursive: true })))

afterEach(setUp.afterEach)

describe('sassFor', () => {
  test('copies the sass directory and converts it into css output', done => {
    const sassFile = `${sassPath}/sassFor.sass`
    fs.writeFileSync(sassFile, sassContents)
    expect.assertions(7)
    const oldContents = fs.readFileSync(sassFile).toString()
    expect(countMatches(oldContents, ';')).toEqual(0)
    expect(countMatches(oldContents, ' {')).toEqual(0)
    expect(countMatches(oldContents, '\n' +
      '    }')).toEqual(0)
    const cssPath = gulpConfig.get('sass.to')
    sassFor(sassFile)
      .on('finish', () => {
        expect(fs.existsSync(cssPath)).toBeTruthy()
        const cssContents = fs.readFileSync(`${cssPath}/sassFor.css`).toString()
        // Will add braces and semicolons
        expect(countMatches(cssContents, ';')).toEqual(13)
        expect(countMatches(cssContents, '{')).toEqual(3)
        expect(countMatches(cssContents, '}')).toEqual(3)
        done()
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done()
      })
  })

  test('also writes a minified .min.css next to the css output', done => {
    const sassFile = `${sassPath}/sassFor.sass`
    fs.writeFileSync(sassFile, sassContents)
    expect.assertions(4)
    const cssPath = gulpConfig.get('sass.to')
    sassFor(sassFile)
      .on('finish', () => {
        const cssContents = fs.readFileSync(`${cssPath}/sassFor.css`).toString()
        const minContents = fs.readFileSync(`${cssPath}/sassFor.min.css`).toString()
        expect(minContents.length).toBeLessThan(cssContents.length)
        expect(countMatches(minContents.trim(), '\n')).toEqual(0)
        expect(minContents).toContain('outline:none')
        expect(minContents).toContain('text-align:center')
        done()
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done()
      })
  })

  test('the minified css is exactly what cssnano produces for a small fixture', done => {
    // Pins cssnano's behaviour (colour minification, shorthand merging, declaration order kept as written), so a
    // future cssnano upgrade that changes the output fails here instead of passing unnoticed
    const sassFile = `${sassPath}/exactOutput.scss`
    fs.writeFileSync(sassFile, '.a { margin: 0px 0px 0px 0px; color: #ff0000; }\n.b { padding: 0px; color: #ff0000; }\n')
    expect.assertions(1)
    const cssPath = gulpConfig.get('sass.to')
    sassFor(sassFile)
      .on('finish', () => {
        try {
          expect(fs.readFileSync(`${cssPath}/exactOutput.min.css`).toString().trim()).toBe('.a{margin:0}.a,.b{color:red}.b{padding:0}')
          done()
        } catch (error) {
          done(error)
        }
      })
      .on('error', error => done(error))
  })

  test('cssnano loads through require(), as the CommonJS dist/partials/sassFor.js does', () => {
    // dist/ is Babel's CommonJS output: `_interopRequireDefault(require('cssnano')).default()`. cssnano 9 is an ES
    // module; require() of it must hand back the plugin function itself for that interop to work.
    const cssnanoRequired = createRequire(import.meta.url)('cssnano')
    const interop = cssnanoRequired && cssnanoRequired.__esModule ? cssnanoRequired : { default: cssnanoRequired }
    expect(typeof interop.default).toBe('function')
    expect(typeof interop.default().postcssPlugin === 'string' || Array.isArray(interop.default().plugins)).toBe(true)
  })
})
