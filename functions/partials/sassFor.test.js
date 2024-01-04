const fs = require('fs')
const setUp = require('../test-helpers/setUp')
setUp.setDefaults('test-sass-for')
const gulpConfig = setUp.gulpConfig
const sassFor = require('./sassFor')
const { countMatches, logObject } = require('../testHelpers')

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

const sassPath = gulpConfig.get('sassPath')

beforeEach(() => {
  setUp.beforeEach()
  return fs.mkdirSync(sassPath, { recursive: true })
})

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
    const cssPath = gulpConfig.get('cssPath')
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
})
