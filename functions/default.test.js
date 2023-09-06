const { setUp } = require('./testHelpers')
const gulpConfig = setUp.gulpConfig
const bundle = require('./bundle')
const dist = require('./dist')
const defaultCmd = require('./default')

const genericFunction = () => Promise.resolve(true)
jest.mock('./bundle', () => jest.fn(genericFunction))
jest.mock('./dist', () => jest.fn(genericFunction))

describe('distMinify', () => {
  test('calls dist for nodeOnly true', done => {
    gulpConfig.set('nodeOnly', true)
    expect.assertions(1)
    defaultCmd()
    setTimeout(() => {
      expect(dist).toHaveBeenCalled()
      done()
    }, 500)
  })

  test('calls dist and bundle for nodeOnly false', done => {
    gulpConfig.set('nodeOnly', false)
    expect.assertions(2)
    defaultCmd()
    setTimeout(() => {
      expect(dist).toHaveBeenCalled()
      expect(bundle).toHaveBeenCalled()
      done()
    }, 500)
  })
})
