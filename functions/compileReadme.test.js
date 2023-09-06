const compileReadme = require('./compileReadme')
const { addToReadme, readmeTemplate} = require('./partials')

const genericFunction = () => Promise.resolve(true)
jest.mock('./partials/addToReadme', () => jest.fn(genericFunction))
jest.mock('./partials/readmeTemplate', () => jest.fn(genericFunction))

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
