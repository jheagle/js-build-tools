const fs = require('fs')
const gulpConfig = require('../gulp.config')
const setUp = require('../tests/setUp')
const clean = require('./clean')

beforeEach(setUp.beforeEach)

afterEach(setUp.afterEach)

describe('clean', () => {
  test('removes all contents of directories specified', async () => {
    expect.assertions(2)
    const srcPath = gulpConfig.get('srcPath')
    expect(fs.readdirSync(srcPath)).toBeTruthy()
    // Run the clean script to empty the directories
    await clean(null, [srcPath])
    expect(fs.existsSync(srcPath)).toBeFalsy()
  })
})
