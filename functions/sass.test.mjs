import fs from 'fs'
import * as setUp from './test-helpers/setUp.mjs'
import { sass } from './sass.mjs'

setUp.setDefaults('test-sass')
const gulpConfig = setUp.gulpConfig

beforeEach(() => setUp.beforeEach().then(
  () => {
    const sassPath = gulpConfig.get('sass.path')
    return fs.mkdirSync(sassPath, { recursive: true })
  }
))

afterEach(setUp.afterEach)

describe('sass', () => {
  test('uses the configured paths', done => {
    const sassPath = gulpConfig.get('sass.path')
    expect.assertions(1)
    sass()
      .on('finish', () => {
        expect(fs.existsSync(sassPath)).toBeTruthy()
        done()
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done()
      })
  }, 10000)
})
