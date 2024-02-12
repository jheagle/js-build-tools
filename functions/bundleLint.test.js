const fs = require('fs')
const setUp = require('./test-helpers/setUp')
setUp.setDefaults('test-bundle-lint')
const gulpConfig = setUp.gulpConfig
const bundleLint = require('./bundleLint')
const { countMatches } = require('test-filesystem')

const lintableContents = 'const gulpConfig = require("../gulp.config.js");\n' +
  'const { dest, src } = require("gulp");\n' +
  'const standard = require("gulp-standard");\n' +
  '\n' +
  '/**\n' +
  ' * Applies Standard code style linting to distribution files.\n' +
  ' * @returns {*}\n' +
  ' */\n' +
  'const bundleLint = () => src(`${gulpConfig.get(\"browserPath\")}/${gulpConfig.get(\"browserName\")}.js`)\n' +
  '  .pipe(standard({ fix: true }))\n' +
  '  .pipe(standard.reporter("default", {\n' +
  '    fix: true,\n' +
  '    quiet: true\n' +
  '  }))\n' +
  '  .pipe(dest(gulpConfig.get("browserPath")));\n' +
  '\n' +
  'module.exports = bundleLint;'

beforeEach(
  () => setUp.beforeEach()
    .then(
      async () => {
        const browserPath = gulpConfig.get('browser.to')
        const browserName = gulpConfig.get('browser.name')
        await fs.mkdirSync(browserPath)
        return fs.writeFileSync(`${browserPath}/${browserName}.js`, lintableContents)
      }
    )
)

afterEach(setUp.afterEach)

describe('bundleLint', () => {
  test('copies the src directory and babelifies it into the dist directory', done => {
    const browserPath = gulpConfig.get('browser.to')
    const browserName = gulpConfig.get('browser.name')
    const fullPath = `${browserPath}/${browserName}.js`
    const oldContents = fs.readFileSync(fullPath).toString()
    expect.assertions(4)
    expect(countMatches(oldContents, '"')).toEqual(14)
    expect(countMatches(oldContents, ';')).toEqual(5)
    bundleLint()
      .on('finish', () => {
        const lintedContents = fs.readFileSync(fullPath).toString()
        expect(countMatches(lintedContents, '"')).toEqual(0)
        expect(countMatches(lintedContents, ';')).toEqual(0)
        done()
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done()
      })
  }, 10000)
})
