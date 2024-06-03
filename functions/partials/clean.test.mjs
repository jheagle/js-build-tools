import fs from 'fs'
import * as setUp from '../test-helpers/setUp.mjs'
import { clean } from './clean.mjs'

setUp.setDefaults('test-clean')
const gulpConfig = setUp.gulpConfig
const srcPath = gulpConfig.get('srcPath')
gulpConfig.set('cleanPaths', [srcPath])

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
