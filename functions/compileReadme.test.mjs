import { jest } from '@jest/globals'

const genericFunction = () => Promise.resolve(true)
jest.unstable_mockModule('./partials/addToReadme.mjs', () => ({ addToReadme: jest.fn(genericFunction) }))
jest.unstable_mockModule('./partials/readmeTemplate.mjs', () => ({ readmeTemplate: jest.fn(genericFunction) }))

const { compileReadme } = await import('./compileReadme.mjs')
const { addToReadme, readmeTemplate } = await import('./partials.mjs')

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

  test('does nothing when readme.enabled is false', async () => {
    const gulpConfig = await import('../gulp.config.mjs')
    readmeTemplate.mockClear()
    addToReadme.mockClear()
    gulpConfig.set('readme.enabled', false)
    try {
      const done = jest.fn()
      await compileReadme(done)
      expect(done).toHaveBeenCalled()
      expect(readmeTemplate).not.toHaveBeenCalled()
      expect(addToReadme).not.toHaveBeenCalled()
    } finally {
      gulpConfig.set('readme.enabled', true)
    }
  })
})
