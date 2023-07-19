const fs = require('fs')
const gulpConfig = require('../gulp.config')
const setUp = require('../tests/setUp')
const distFor = require('./distFor')
const { countMatches } = require('./testHelpers')

const rawContents = 'const babel = require(\'gulp-babel\')\n' +
  'const { dest, src } = require(\'gulp\')\n' +
  'const gulpConfig = require(\'../gulp.config.js\')\n' +
  '\n' +
  '/**\n' +
  ' * Build the distribution for a given source pattern.\n' +
  ' * @param {string|array} srcPath\n' +
  ' * @param {string} destPath\n' +
  ' * @returns {*}\n' +
  ' */\n' +
  'const distFor = (srcPath = gulpConfig.get(\'srcSearch\'), destPath = gulpConfig.get(\'distPath\')) => src(srcPath)\n' +
  '  .pipe(babel())\n' +
  '  .pipe(dest(destPath))\n' +
  '\n' +
  'module.exports = distFor\n'

beforeEach(
  () => setUp.beforeEach()
    .then(
      async () => {
        const srcPath = gulpConfig.get('srcPath')
        return fs.writeFileSync(`${srcPath}/distFor.js`, rawContents)
      }
    )
)

afterEach(setUp.afterEach)

describe('distFor', () => {
  test('copies the src directory and babelifies it into the dist directory', done => {
    const distPath = gulpConfig.get('distPath')
    const srcPath = gulpConfig.get('srcPath')
    expect.assertions(12)
    expect(fs.existsSync(distPath)).toBeFalsy()
    const oldContents = fs.readFileSync(`${srcPath}/distFor.js`).toString()
    expect(countMatches(oldContents, '\'use strict\'')).toEqual(0)
    expect(countMatches(oldContents, 'const ')).toEqual(4)
    expect(countMatches(oldContents, 'var ')).toEqual(0)
    expect(countMatches(oldContents, 'function')).toEqual(0)
    expect(countMatches(oldContents, 'arguments')).toEqual(0)
    distFor(gulpConfig.get('srcSearch'))
      .on('end', () => {
        expect(fs.existsSync(distPath)).toBeTruthy()
        const babelifiedContents = fs.readFileSync(`${distPath}/distFor.js`).toString()
        expect(countMatches(babelifiedContents, '"use strict"')).toEqual(1)
        expect(countMatches(babelifiedContents, 'const ')).toEqual(0)
        expect(countMatches(babelifiedContents, 'var ')).toEqual(6)
        expect(countMatches(babelifiedContents, 'function')).toEqual(1)
        expect(countMatches(babelifiedContents, 'arguments')).toEqual(6)
        done()
      })
  })
})
