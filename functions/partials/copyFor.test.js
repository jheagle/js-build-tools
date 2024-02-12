const fs = require('fs')
const setUp = require('../test-helpers/setUp')
setUp.setDefaults('test-copy-for')
const gulpConfig = setUp.gulpConfig
const copyFor = require('./copyFor')

const fileContents = 'some file contents'

beforeEach(setUp.beforeEach)

afterEach(setUp.afterEach)

describe('copyFor', () => {
  test('copies the file and ', done => {
    const srcPath = gulpConfig.get('srcPath')
    const copyFile = `${srcPath}/fileToCopy.txt`
    fs.writeFileSync(copyFile, fileContents)
    expect.assertions(3)
    const oldContents = fs.readFileSync(copyFile).toString()
    expect(oldContents).toEqual(fileContents)
    const browserPath = gulpConfig.get('browser.to')
    copyFor(copyFile, browserPath)
      .on('finish', () => {
        expect(fs.existsSync(browserPath)).toBeTruthy()
        const movedContents = fs.readFileSync(`${browserPath}/fileToCopy.txt`).toString()
        expect(movedContents).toEqual(fileContents)
        done()
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done()
      })
  })
})
