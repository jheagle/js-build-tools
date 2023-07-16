const fs = require('fs')
const gulpConfig = require('../gulp.config')
const setUp = require('../tests/setUp')
const dist = require('./dist')
const fsExtra = require('fs-extra')

beforeEach(() => setUp.beforeEach()
  .then(() => fs.copyFileSync('functions/dist.js', gulpConfig.get('srcPath') + '/dist.js')))

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
