import { afterEach, createTempDir, gulpConfig, setDefaults } from './setUp.mjs'
import fs from 'fs'

setDefaults()

describe('setUp', () => {
  test('able to create the test-temp/src directory', async () => {
    const srcPath = gulpConfig.get('srcPath')
    expect(fs.existsSync(srcPath)).toBeFalsy()
    await createTempDir()
    expect(fs.existsSync(srcPath)).toBeTruthy()
  })

  test('able to delete the test-temp/src directory', async () => {
    expect(fs.existsSync(gulpConfig.get('srcPath'))).toBeTruthy()
    await afterEach()
    expect(fs.existsSync(gulpConfig.get('srcPath'))).toBeFalsy()
  })
})
