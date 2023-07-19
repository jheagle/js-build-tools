const fs = require('fs')
const gulpConfig = require('../gulp.config')
const setUp = require('../tests/setUp')
const distLint = require('./distLint')
const { countMatches } = require('./testHelpers')

const lintableContents = 'const gulpConfig = require("../gulp.config.js");\n' +
  'const { dest, src } = require("gulp");\n' +
  'const standard = require("gulp-standard");\n' +
  '\n' +
  '/**\n' +
  ' * Applies Standard code style linting to distribution files.\n' +
  ' * @returns {*}\n' +
  ' */\n' +
  'const distLint = () => src(gulpConfig.get("distSearch"))\n' +
  '  .pipe(standard({ fix: true }))\n' +
  '  .pipe(standard.reporter("default", {\n' +
  '    fix: true,\n' +
  '    quiet: true\n' +
  '  }))\n' +
  '  .pipe(dest(gulpConfig.get("distPath")));\n' +
  '\n' +
  'module.exports = distLint;'

beforeEach(
  () => setUp.beforeEach()
    .then(
      async () => {
        const distPath = gulpConfig.get('distPath')
        await fs.mkdirSync(distPath)
        return fs.writeFileSync(`${distPath}/distLint.js`, lintableContents)
      }
    )
)

afterEach(setUp.afterEach)

describe('distLint', () => {
  test('copies the src directory and babelifies it into the dist directory', done => {
    const distPath = gulpConfig.get('distPath')
    const oldContents = fs.readFileSync(`${distPath}/distLint.js`).toString()
    expect(countMatches(oldContents, '"')).toEqual(12)
    expect(countMatches(oldContents, ';')).toEqual(5)
    distLint()
      .on('end', () => {
        expect(fs.existsSync(distPath)).toBeTruthy()
        const lintedContents = fs.readFileSync(`${distPath}/distLint.js`).toString()
        expect(countMatches(lintedContents, '"')).toEqual(0)
        expect(countMatches(lintedContents, ';')).toEqual(0)
        done()
      })
  })
})
