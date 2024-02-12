const fs = require('fs')
const setUp = require('./test-helpers/setUp')
setUp.setDefaults('test-copy-fonts')
const gulpConfig = setUp.gulpConfig
const copyFonts = require('./copyFonts')

const fontContent = 'comic sans'

beforeEach(setUp.beforeEach)

afterEach(setUp.afterEach)

describe('copyFonts', () => {
  test('uses the configured paths', done => {
    const srcPath = gulpConfig.get('srcPath') + '/fonts'
    fs.mkdirSync(srcPath, { recursive: true })
    const fontFile = `${srcPath}/comic-sans.woff`
    fs.writeFileSync(fontFile, fontContent)
    const fontPath = gulpConfig.get('fonts.to')
    expect.assertions(1)
    copyFonts()
      .on('finish', () => {
        expect(fs.existsSync(fontPath)).toBeTruthy()
        done()
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done()
      })
  }, 10000)
})
