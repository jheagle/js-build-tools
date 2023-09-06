const { setUp } = require('./testHelpers')
const gulpConfig = setUp.gulpConfig
const bundleMinify = require('./bundleMinify')
const minifyFor = require('./partials/minifyFor')

jest.mock('./partials/minifyFor', () => jest.fn(() => Promise.resolve(true)))

describe('bundleMinify', () => {
  test('calls minifyFor with configurations', () => {
    expect.assertions(1)
    bundleMinify()
    expect(minifyFor).toHaveBeenCalledWith(`${gulpConfig.get('browserPath')}/${gulpConfig.get('browserName')}.js`, gulpConfig.get('browserPath'))
  })
})
