const setUp = require('../test-helpers/setUp')
const gulpConfig = setUp.gulpConfig
const distSeries = require('./distSeries')
const tsFor = require('./tsFor')
const distFor = require('./distFor')

const genericFunction = () => Promise.resolve(true)

jest.mock('./distFor', () => jest.fn(genericFunction))
jest.mock('./tsFor', () => jest.fn(genericFunction))

describe('distSeries', () => {
  test('when not using ts config only returns runnable distFor', done => {
    gulpConfig.set('useTsConfig', false)
    expect.assertions(1)
    distSeries()()
    setTimeout(() => {
      expect(distFor).toHaveBeenCalledWith(gulpConfig.get('srcSearch'), gulpConfig.get('distPath'))
      done()
    }, 500)
  })

  test('when using ts config returns runnable series of tsFor and distFor', done => {
    gulpConfig.set('useTsConfig', true)
    expect.assertions(2)
    distSeries()()
    setTimeout(() => {
      expect(tsFor).toHaveBeenCalledWith(gulpConfig.get('tsSearch'), gulpConfig.get('distPath'))
      expect(distFor).toHaveBeenCalledWith(gulpConfig.get('distSearch'), gulpConfig.get('distPath'))
      done()
    }, 500)
  })
})
