import { testHelpers } from './testHelpers.mjs'
import { bundleMinify } from './bundleMinify.mjs'
import { minifyFor } from './partials/minifyFor.mjs'

const gulpConfig = testHelpers.gulpConfig

jest.mock('./partials/minifyFor.mjs', () => ({ minifyFor: jest.fn(() => Promise.resolve(true)) }))

describe('bundleMinify', () => {
  test('calls minifyFor with configurations', () => {
    expect.assertions(1)
    bundleMinify()
    expect(minifyFor).toHaveBeenCalledWith(`${gulpConfig.get('browser.to')}/${gulpConfig.get('browser.name')}.js`, gulpConfig.get('browser.to'))
  })
})
