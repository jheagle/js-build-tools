import * as setUp from './test-helpers/setUp.mjs'
import { docs } from './docs.mjs'
import { typeDocs } from './typeDocs.mjs'
import { jsdocDocs } from './jsdocDocs.mjs'

const genericFunction = () => Promise.resolve(true)

jest.mock('./typeDocs.mjs', () => ({ typeDocs: jest.fn(genericFunction) }))
jest.mock('./jsdocDocs.mjs', () => ({ jsdocDocs: jest.fn(genericFunction) }))

setUp.setDefaults('test-docs')
const gulpConfig = setUp.gulpConfig

beforeEach(() => setUp.beforeEach().then(() => {
  typeDocs.mockClear()
  jsdocDocs.mockClear()
}))

afterEach(setUp.afterEach)

describe('docs', () => {
  test('runs jsdocDocs when resolveDocsMethod infers jsdoc', async () => {
    gulpConfig.set('typescript.enabled', false)
    gulpConfig.set('docs.method', false)
    await docs()
    expect(jsdocDocs).toHaveBeenCalledTimes(1)
    expect(typeDocs).not.toHaveBeenCalled()
  })

  test('runs typeDocs when resolveDocsMethod infers typedoc', async () => {
    gulpConfig.set('typescript.enabled', true)
    gulpConfig.set('docs.method', false)
    await docs()
    expect(typeDocs).toHaveBeenCalledTimes(1)
    expect(jsdocDocs).not.toHaveBeenCalled()
  })

  test('docs.method overrides the typescript.enabled inference either way', async () => {
    gulpConfig.set('typescript.enabled', true)
    gulpConfig.set('docs.method', 'jsdoc')
    await docs()
    expect(jsdocDocs).toHaveBeenCalledTimes(1)
    expect(typeDocs).not.toHaveBeenCalled()
  })
})
