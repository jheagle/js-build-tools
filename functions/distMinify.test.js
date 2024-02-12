const { setUp } = require('./testHelpers')
const gulpConfig = setUp.gulpConfig
const distMinify = require('./distMinify')
const minifyFor = require('./partials/minifyFor')

jest.mock('./partials/minifyFor', () => jest.fn(() => Promise.resolve(true)))

describe('distMinify', () => {
  test('calls minifyFor with configurations', () => {
    expect.assertions(1)
    distMinify()
    expect(minifyFor).toHaveBeenCalledWith(gulpConfig.get('browser.from'), gulpConfig.get('dist.to'))
  })
})
