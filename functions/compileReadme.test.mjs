import { compileReadme } from './compileReadme.mjs'
import { addToReadme, readmeTemplate } from './partials.mjs'

const genericFunction = () => Promise.resolve(true)
jest.mock('./partials/addToReadme.mjs', () => ({ addToReadme: jest.fn(genericFunction) }))
jest.mock('./partials/readmeTemplate.mjs', () => ({ readmeTemplate: jest.fn(genericFunction) }))

describe('compileReadme', () => {
  test('calls readmeTemplate and addToReadme', done => {
    expect.assertions(2)
    compileReadme()
    setTimeout(() => {
      expect(readmeTemplate).toHaveBeenCalled()
      expect(addToReadme).toHaveBeenCalled()
      done()
    }, 500)
  })
})
