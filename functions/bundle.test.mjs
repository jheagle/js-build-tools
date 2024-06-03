import fs from 'fs'
import * as setUp from './test-helpers/setUp.mjs'
import { bundle } from './bundle.mjs'
import { countMatches } from 'test-filesystem'

setUp.setDefaults('test-bundle')
const gulpConfig = setUp.gulpConfig

const file1Contents = 'function file1 () {\n' +
  '  console.log(\'Hello from file1\')\n' +
  '}\n' +
  '\n' +
  'module.exports = file1\n'
const file2Contents = 'function file2 () {\n' +
  '  console.log(\'Good-bye from file2\')\n' +
  '}\n' +
  '\n' +
  'module.exports = file2\n'
const mainFileContents = 'const file1 = require(\'./sources/file1\')\n' +
  'const file2 = require(\'./sources/file2\')\n' +
  '\n' +
  'module.exports = {\n' +
  '  file1,\n' +
  '  file2,\n' +
  '}\n'

beforeEach(
  () => setUp.beforeEach()
    .then(
      async () => {
        const distPath = gulpConfig.get('dist.to')
        const mainFile = gulpConfig.get('dist.main')
        const sourcesPath = `${distPath}/sources`
        await fs.mkdirSync(distPath)
        await fs.mkdirSync(sourcesPath)
        await fs.writeFileSync(`${sourcesPath}/file1.js`, file1Contents)
        await fs.writeFileSync(`${sourcesPath}/file2.js`, file2Contents)
        return fs.writeFileSync(`${mainFile}.js`, mainFileContents)
      }
    )
)

afterEach(setUp.afterEach)

describe('bundle', () => {
  test('copies all the dist contents into a single file for browsers', done => {
    const distPath = gulpConfig.get('dist.to')
    const destFile = `${gulpConfig.get('browser.name')}.js`
    const destPath = gulpConfig.get('browser.to')
    const bundledFile = `${destPath}/${destFile}`
    const sourcesPath = `${distPath}/sources`
    const file1Path = `${sourcesPath}/file1.js`
    const file2Path = `${sourcesPath}/file2.js`
    const oldFile1Contents = fs.readFileSync(file1Path).toString()
    const oldFile2Contents = fs.readFileSync(file2Path).toString()
    expect.assertions(2)
    bundle()
      .on('finish', () => {
        const bundledContents = fs.readFileSync(bundledFile).toString()
        expect(countMatches(bundledContents, oldFile1Contents)).toEqual(1)
        expect(countMatches(bundledContents, oldFile2Contents)).toEqual(1)
        done()
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done()
      })
  })
})
