import fs from 'fs'
import * as setUp from '../test-helpers/setUp.mjs'
import { copyFor } from './copyFor.mjs'

setUp.setDefaults('test-copy-for')
const gulpConfig = setUp.gulpConfig

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

  test('copies binary files byte for byte, including a leading BOM and bytes above 0x7f', done => {
    const srcPath = gulpConfig.get('srcPath')
    const binaryFile = `${srcPath}/font.woff`
    const original = Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(Array.from({ length: 512 }, (_, i) => i % 256))])
    fs.writeFileSync(binaryFile, original)
    expect.assertions(1)
    const browserPath = gulpConfig.get('browser.to')
    copyFor(binaryFile, browserPath)
      .on('finish', () => {
        expect(fs.readFileSync(`${browserPath}/font.woff`).equals(original)).toBeTruthy()
        done()
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done()
      })
  })
})
