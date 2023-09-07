const { afterEach, createTempDir, gulpConfig, setDefaults } = require('./setUp')
const fs = require('fs')

setDefaults()

describe('setUp', () => {
  test('able to create the test-temp/src directory', async () => {
    expect(fs.existsSync(gulpConfig.get('srcPath'))).toBeFalsy()
    await createTempDir()
    expect(fs.existsSync(gulpConfig.get('srcPath'))).toBeTruthy()
  })

  test('able to delete the test-temp/src directory',  async () => {
    expect(fs.existsSync(gulpConfig.get('srcPath'))).toBeTruthy()
    await afterEach()
    expect(fs.existsSync(gulpConfig.get('srcPath'))).toBeFalsy()
  })
})
