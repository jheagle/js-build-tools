const setUp = require('../test-helpers/setUp')
const gulpConfig = setUp.gulpConfig
const distForSrc = require('./distForSrc')

describe('distForSrc', () => {
  test('typescript.enabled as false returns srcSearch', () => {
    expect.assertions(1)
    gulpConfig.set('typescript.enabled', false)
    expect(distForSrc()).toBe(gulpConfig.get('dist.from'))
  })

  test('typescript.enabled as true returns distSearch', () => {
    expect.assertions(1)
    gulpConfig.set('typescript.enabled', true)
    expect(distForSrc()).toBe(gulpConfig.get('browser.from'))
  })
})
