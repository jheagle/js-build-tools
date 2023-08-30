const setUp = require('../test-helpers/setUp')
const gulpConfig = setUp.gulpConfig
const distForSrc = require('./distForSrc')

describe('distForSrc', () => {
  test('useTsConfig as false returns srcSearch', () => {
    expect.assertions(1)
    gulpConfig.set('useTsConfig', false)
    expect(distForSrc()).toBe(gulpConfig.get('srcSearch'))
  })

  test('useTsConfig as true returns distSearch', () => {
    expect.assertions(1)
    gulpConfig.set('useTsConfig', true)
    expect(distForSrc()).toBe(gulpConfig.get('distSearch'))
  })
})
