import { jest } from '@jest/globals'
import { testHelpers } from './testHelpers.mjs'

const gulpConfig = testHelpers.gulpConfig

jest.unstable_mockModule('./partials/minifyFor.mjs', () => ({ minifyFor: jest.fn(() => Promise.resolve(true)) }))

const { bundleMinify } = await import('./bundleMinify.mjs')
const { minifyFor } = await import('./partials/minifyFor.mjs')

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
