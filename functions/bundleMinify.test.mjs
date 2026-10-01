import { testHelpers } from './testHelpers.mjs'
import { bundleMinify } from './bundleMinify.mjs'
import { minifyFor } from './partials/minifyFor.mjs'

const gulpConfig = testHelpers.gulpConfig

jest.mock('./partials/minifyFor.mjs', () => ({ minifyFor: jest.fn(() => Promise.resolve(true)) }))

describe('bundleMinify', () => {
  afterEach(() => {
    gulpConfig.set('browser.bundles', [])
    minifyFor.mockClear()
  })

  test('calls minifyFor with the primary bundle', () => {
    expect.assertions(1)
    bundleMinify()
    expect(minifyFor).toHaveBeenCalledWith(
      [`${gulpConfig.get('browser.to')}/${gulpConfig.get('browser.name')}.js`],
      gulpConfig.get('browser.to')
    )
  })

  test('calls minifyFor once, with every additional bundle included in the same array', () => {
    gulpConfig.set('browser.bundles', [{ name: 'renderOnly' }])
    expect.assertions(2)
    bundleMinify()
    expect(minifyFor).toHaveBeenCalledTimes(1)
    expect(minifyFor).toHaveBeenCalledWith(
      [
        `${gulpConfig.get('browser.to')}/${gulpConfig.get('browser.name')}.js`,
        `${gulpConfig.get('browser.to')}/renderOnly.js`
      ],
      gulpConfig.get('browser.to')
    )
  })
})
