const fs = require('fs')
const gulpConfig = require('../gulp.config')
const setUp = require('../tests/setUp')
const minifyFor = require('./minifyFor')
const { countMatches } = require('./testHelpers')

const rawContents = 'const { dest, src } = require(\'gulp\')\n' +
  'const { default: uglify } = require(\'gulp-uglify-es\')\n' +
  'const rename = require(\'gulp-rename\')\n' +
  '\n' +
  '/**\n' +
  ' * Minify files and rename the output with \'.min\' extension.\n' +
  ' * @returns {*}\n' +
  ' */\n' +
  'const minifyFor = (srcSearch, destination) => src(srcSearch)\n' +
  '  .pipe(uglify())\n' +
  '  .pipe(rename({ extname: \'.min.js\' }))\n' +
  '  .pipe(dest(destination))\n' +
  '\n' +
  'module.exports = minifyFor\n'

beforeEach(() => setUp.beforeEach()
  .then(() => fs.writeFileSync(gulpConfig.get('srcPath') + '/minifyFor.js', rawContents)))

afterEach(setUp.afterEach)

describe('minifyFor', () => {
  test('copies the src directory and minifies it into the dist directory with min extension', done => {
    const srcPath = gulpConfig.get('srcPath')
    const filePath = `${srcPath}/minifyFor.js`
    const expectedFilePath = `${srcPath}/minifyFor.min.js`
    expect.assertions(3)
    const oldContents = fs.readFileSync(filePath).toString()
    expect(countMatches(oldContents, "\n")).toBe(14)
    minifyFor(filePath, srcPath)
      .on('finish', () => {
        expect(fs.existsSync(expectedFilePath)).toBeTruthy()
        const minifiedContents = fs.readFileSync(expectedFilePath).toString()
        expect(countMatches(minifiedContents, "\n")).toBe(0)
        done()
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done()
      })
  })
})
