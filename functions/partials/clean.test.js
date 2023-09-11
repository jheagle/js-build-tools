const fs = require('fs')
const setUp = require('../test-helpers/setUp')
setUp.setDefaults('test-clean')
const gulpConfig = setUp.gulpConfig
const srcPath = gulpConfig.get('srcPath')
gulpConfig.set('cleanPaths', [srcPath])
const clean = require('./clean')

beforeEach(setUp.beforeEach)

afterEach(setUp.afterEach)

describe('clean', () => {
  test('removes all contents of directories specified', async () => {
    expect.assertions(2)
    expect(fs.readdirSync(srcPath)).toBeTruthy()
    // Run the clean script to empty the directories
    await clean()
    expect(fs.existsSync(srcPath)).toBeFalsy()
  })
})
