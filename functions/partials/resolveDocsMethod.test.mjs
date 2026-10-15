import * as setUp from '../test-helpers/setUp.mjs'
import { resolveDocsMethod } from './resolveDocsMethod.mjs'

setUp.setDefaults('test-resolve-docs-method')
const gulpConfig = setUp.gulpConfig

beforeEach(setUp.beforeEach)

afterEach(setUp.afterEach)

describe('resolveDocsMethod', () => {
  test('infers jsdoc when typescript.enabled is false and docs.method is unset', () => {
    gulpConfig.set('typescript.enabled', false)
    gulpConfig.set('docs.method', false)
    expect(resolveDocsMethod()).toBe('jsdoc')
  })

  test('infers typedoc when typescript.enabled is true and docs.method is unset', () => {
    gulpConfig.set('typescript.enabled', true)
    gulpConfig.set('docs.method', false)
    expect(resolveDocsMethod()).toBe('typedoc')
  })

  test('docs.method overrides the typescript.enabled inference either way', () => {
    gulpConfig.set('typescript.enabled', true)
    gulpConfig.set('docs.method', 'jsdoc')
    expect(resolveDocsMethod()).toBe('jsdoc')

    gulpConfig.set('typescript.enabled', false)
    gulpConfig.set('docs.method', 'typedoc')
    expect(resolveDocsMethod()).toBe('typedoc')
  })
})
