const fs = require('fs')
const gulpConfig = require('../gulp.config')
const setUp = require('../tests/setUp')
const dist = require('./dist')

const rawContents = 'const distFor = require(\'./distFor.js\')\n' +
  '\n' +
  '/**\n' +
  ' * Simplified distribution tasks which will use arguments from distFor.\n' +
  ' * @returns {*}\n' +
  ' */\n' +
  'const dist = () => distFor()\n' +
  '\n' +
  'module.exports = dist\n'

beforeEach(
  () => setUp.beforeEach()
    .then(
      async () => {
        const srcPath = gulpConfig.get('srcPath')
        return fs.writeFileSync(`${srcPath}/dist.js`, rawContents)
      }
    )
)

afterEach(setUp.afterEach)

describe('dist', () => {
  test('uses the configured paths', done => {
    const distPath = gulpConfig.get('distPath')
    expect.assertions(2)
    expect(fs.existsSync(distPath)).toBeFalsy()
    dist()
      .on('end', () => {
        expect(fs.existsSync(distPath)).toBeTruthy()
        done()
      })
  })
})
