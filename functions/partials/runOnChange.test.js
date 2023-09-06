const fs = require('fs')
const setUp = require('../test-helpers/setUp')
setUp.setDefaults('test-run-on-change')
const gulpConfig = setUp.gulpConfig
const bundle = require('../bundle')
const distFor = require('./distFor')
const runOnChange = require('./runOnChange')
const tsFor = require('./tsFor')
const testQuick = require('../testQuick')

const genericFunction = () => Promise.resolve(true)

jest.mock('../bundle', () => jest.fn(genericFunction))
jest.mock('./distFor', () => jest.fn(genericFunction))
jest.mock('./tsFor', () => jest.fn(genericFunction))
jest.mock('../testQuick', () => jest.fn(genericFunction))

const rawContents = 'export function sayHello(name: string) {\n' +
  '  return `Hello from ${name}`;\n' +
  '}'

const distPath = gulpConfig.get('distPath') + '/'
const srcPath = gulpConfig.get('srcPath')
const srcFile = `${srcPath}/runOnChange.js`
const srcTsFile = `${srcPath}/runOnChange.ts`

beforeEach(() => {
    return setUp.beforeEach()
      .then(() => fs.writeFileSync(srcTsFile, rawContents))
      .then(() => fs.writeFileSync(srcFile, rawContents))
  }
)

afterEach(() => {
  jest.clearAllMocks()
  return setUp.afterEach()
})

describe('runOnChange', () => {
  test('runs testQuick and distFor for nodeOnly true and useTs false', done => {
    gulpConfig.set('nodeOnly', true)
    gulpConfig.set('useTsConfig', false)
    expect.assertions(2)
    runOnChange(srcFile)
    setTimeout(() => {
      expect(testQuick).toHaveBeenCalled()
      expect(distFor).toHaveBeenCalledWith(srcFile, distPath)
      done()
    }, 500)
  })

  test('runs testQuick and distFor for nodeOnly true and tsFor for useTs true', done => {
    gulpConfig.set('nodeOnly', true)
    gulpConfig.set('useTsConfig', true)
    const distSrcPath = distPath + 'runOnChange.js'
    expect.assertions(3)
    runOnChange(srcTsFile)
    setTimeout(() => {
      expect(testQuick).toHaveBeenCalled()
      expect(tsFor).toHaveBeenCalledWith(srcTsFile, distPath)
      expect(distFor).toHaveBeenCalledWith(distSrcPath, distPath)
      done()
    }, 500)
  })

  test('runs testQuick and distFor then bundle for nodeOnly false and useTs false', done => {
    gulpConfig.set('nodeOnly', false)
    gulpConfig.set('useTsConfig', false)
    expect.assertions(3)
    runOnChange(srcFile)
    setTimeout(() => {
      expect(testQuick).toHaveBeenCalled()
      expect(distFor).toHaveBeenCalledWith(srcFile, distPath)
      expect(bundle).toHaveBeenCalled()
      done()
    }, 500)
  })

  test('runs testQuick and distFor then bundle for nodeOnly false and tsFor for useTs true', done => {
    gulpConfig.set('nodeOnly', false)
    gulpConfig.set('useTsConfig', true)
    const distSrcPath = distPath + 'runOnChange.js'
    expect.assertions(4)
    runOnChange(srcTsFile)
    setTimeout(() => {
      expect(testQuick).toHaveBeenCalled()
      expect(tsFor).toHaveBeenCalledWith(srcTsFile, distPath)
      expect(distFor).toHaveBeenCalledWith(distSrcPath, distPath)
      expect(bundle).toHaveBeenCalled()
      done()
    }, 500)
  })
})
