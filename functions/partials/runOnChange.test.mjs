import { jest } from '@jest/globals'
/* eslint-disable no-template-curly-in-string -- fixture source code, the ${...} is meant to stay literal */
import fs from 'fs'
import * as setUp from '../test-helpers/setUp.mjs'

setUp.setDefaults('test-run-on-change')
const gulpConfig = setUp.gulpConfig

const genericFunction = () => Promise.resolve(true)

jest.unstable_mockModule('../bundle.mjs', () => ({ bundle: jest.fn(genericFunction) }))
jest.unstable_mockModule('./distFor.mjs', () => ({ distFor: jest.fn(genericFunction) }))
jest.unstable_mockModule('./tsFor.mjs', () => ({ tsFor: jest.fn(() => genericFunction) }))
jest.unstable_mockModule('../testQuick.mjs', () => ({ testQuick: jest.fn(genericFunction) }))

const { bundle } = await import('../bundle.mjs')
const { distFor } = await import('./distFor.mjs')
const { runOnChange } = await import('./runOnChange.mjs')
const { tsFor } = await import('./tsFor.mjs')
const { testQuick } = await import('../testQuick.mjs')

const rawContents = 'export function sayHello(name: string) {\n' +
  '  return `Hello from ${name}`;\n' +
  '}'

const distPath = gulpConfig.get('dist.to') + '/'
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
    gulpConfig.set('browser.enabled', false)
    gulpConfig.set('typescript.enabled', false)
    expect.assertions(2)
    runOnChange(srcFile)
    setTimeout(() => {
      expect(testQuick).toHaveBeenCalled()
      expect(distFor).toHaveBeenCalledWith(srcFile, distPath)
      done()
    }, 500)
  })

  test('runs testQuick and distFor for nodeOnly true and tsFor for useTs true', done => {
    gulpConfig.set('browser.enabled', false)
    gulpConfig.set('typescript.enabled', true)
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
    gulpConfig.set('browser.enabled', true)
    gulpConfig.set('typescript.enabled', false)
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
    gulpConfig.set('browser.enabled', true)
    gulpConfig.set('typescript.enabled', true)
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
