import * as setUp from '../test-helpers/setUp.mjs'
import { distForSrc } from './distForSrc.mjs'

const gulpConfig = setUp.gulpConfig

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
