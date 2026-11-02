import { jest } from '@jest/globals'
import { testHelpers } from './testHelpers.mjs'

const gulpConfig = testHelpers.gulpConfig

const genericFunction = () => Promise.resolve(true)
jest.unstable_mockModule('./bundle.mjs', () => ({ bundle: jest.fn(genericFunction) }))
jest.unstable_mockModule('./dist.mjs', () => ({ dist: jest.fn(genericFunction) }))

const { bundle } = await import('./bundle.mjs')
const { dist } = await import('./dist.mjs')
const { defaultCmd } = await import('./default.mjs')

describe('distMinify', () => {
  test('calls dist for nodeOnly true', done => {
    gulpConfig.set('browser.enabled', false)
    expect.assertions(1)
    defaultCmd()
    setTimeout(() => {
      expect(dist).toHaveBeenCalled()
      done()
    }, 500)
  })

  test('calls dist and bundle for nodeOnly false', done => {
    gulpConfig.set('browser.enabled', true)
    expect.assertions(2)
    defaultCmd()
    setTimeout(() => {
      expect(dist).toHaveBeenCalled()
      expect(bundle).toHaveBeenCalled()
      done()
    }, 500)
  })
})
