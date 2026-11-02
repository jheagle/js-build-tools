import { jest } from '@jest/globals'
import { testHelpers } from './testHelpers.mjs'

const gulpConfig = testHelpers.gulpConfig

jest.unstable_mockModule('./partials/minifyFor.mjs', () => ({ minifyFor: jest.fn(() => Promise.resolve(true)) }))

const { distMinify } = await import('./distMinify.mjs')
const { minifyFor } = await import('./partials/minifyFor.mjs')

describe('distMinify', () => {
  test('calls minifyFor with configurations', () => {
    expect.assertions(1)
    distMinify()
    expect(minifyFor).toHaveBeenCalledWith(gulpConfig.get('browser.from'), gulpConfig.get('dist.to'))
  })
})
