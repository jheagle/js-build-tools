import { typeDocs } from './typeDocs.mjs'
import { typeDocsFor } from './partials/typeDocsFor.mjs'

jest.mock('./partials/typeDocsFor.mjs', () => ({ typeDocsFor: jest.fn(() => () => null) }))

describe('typeDocs', () => {
  test('is the task made by typeDocsFor with no parameters', () => {
    expect(typeDocsFor).toHaveBeenCalledWith()
    expect(typeDocs).toBeInstanceOf(Function)
  })
})
