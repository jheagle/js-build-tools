import { jest } from '@jest/globals'

jest.unstable_mockModule('./partials/typeDocsFor.mjs', () => ({ typeDocsFor: jest.fn(() => () => null) }))

const { typeDocs } = await import('./typeDocs.mjs')
const { typeDocsFor } = await import('./partials/typeDocsFor.mjs')

describe('typeDocs', () => {
  test('is the task made by typeDocsFor with no parameters', () => {
    expect(typeDocsFor).toHaveBeenCalledWith()
    expect(typeDocs).toBeInstanceOf(Function)
  })
})
