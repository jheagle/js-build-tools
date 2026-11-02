import { jest } from '@jest/globals'
import * as setUp from '../test-helpers/setUp.mjs'

const gulpConfig = setUp.gulpConfig

const genericFunction = () => Promise.resolve(true)

jest.unstable_mockModule('./distFor.mjs', () => ({ distFor: jest.fn(genericFunction) }))
jest.unstable_mockModule('./tsFor.mjs', () => ({ tsFor: jest.fn(() => genericFunction) }))

const { distSeries } = await import('./distSeries.mjs')
const { tsFor } = await import('./tsFor.mjs')
const { distFor } = await import('./distFor.mjs')

describe('distSeries', () => {
  test('when not using ts config only returns runnable distFor', done => {
    gulpConfig.set('typescript.enabled', false)
    expect.assertions(1)
    distSeries()()
    setTimeout(() => {
      expect(distFor).toHaveBeenCalledWith(gulpConfig.get('dist.from'), gulpConfig.get('dist.to'))
      done()
    }, 500)
  })

  test('when using ts config returns runnable series of tsFor and distFor', done => {
    gulpConfig.set('typescript.enabled', true)
    expect.assertions(2)
    distSeries()()
    setTimeout(() => {
      expect(tsFor).toHaveBeenCalledWith(gulpConfig.get('typescript.from'), gulpConfig.get('dist.to'))
      expect(distFor).toHaveBeenCalledWith(gulpConfig.get('browser.from'), gulpConfig.get('dist.to'))
      done()
    }, 500)
  })
})
