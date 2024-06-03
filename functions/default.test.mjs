import { testHelpers } from './testHelpers.mjs'
import { bundle } from './bundle.mjs'
import { dist } from './dist.mjs'
import { defaultCmd } from './default.mjs'

const gulpConfig = testHelpers.gulpConfig

const genericFunction = () => Promise.resolve(true)
jest.mock('./bundle.mjs', () => ({ bundle: jest.fn(genericFunction) }))
jest.mock('./dist.mjs', () => ({ dist: jest.fn(genericFunction) }))

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
