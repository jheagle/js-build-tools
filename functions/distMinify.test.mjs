import { testHelpers } from './testHelpers.mjs'
import { distMinify } from './distMinify.mjs'
import { minifyFor } from './partials/minifyFor.mjs'

const gulpConfig = testHelpers.gulpConfig

jest.mock('./partials/minifyFor.mjs', () => ({ minifyFor: jest.fn(() => Promise.resolve(true)) }))

describe('distMinify', () => {
  test('calls minifyFor with configurations', () => {
    expect.assertions(1)
    distMinify()
    expect(minifyFor).toHaveBeenCalledWith(gulpConfig.get('browser.from'), gulpConfig.get('dist.to'))
  })
})
