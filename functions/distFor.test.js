const fs = require('fs')
const gulpConfig = require('../gulp.config')
const setUp = require('../tests/setUp')
const distFor = require('./distFor')

beforeEach(() => setUp.beforeEach()
  .then(() => fs.copyFileSync('functions/distFor.js', gulpConfig.get('srcPath') + '/distFor.js')))

afterEach(setUp.afterEach)

describe('distFor', () => {
  test('copies the src directory and babelifies it into the dist directory', done => {
    const distPath = gulpConfig.get('distPath')
    expect.assertions(2)
    expect(fs.existsSync(distPath)).toBeFalsy()
    distFor(gulpConfig.get('srcSearch'))
      .on('end', () => {
        expect(fs.existsSync(distPath)).toBeTruthy()
        done()
      })
  })
})
