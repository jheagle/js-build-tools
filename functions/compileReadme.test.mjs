import { jest } from '@jest/globals'

const genericFunction = () => Promise.resolve(true)
jest.unstable_mockModule('./partials/addToReadme.mjs', () => ({ addToReadme: jest.fn(genericFunction) }))
jest.unstable_mockModule('./partials/readmeTemplate.mjs', () => ({ readmeTemplate: jest.fn(genericFunction) }))

const { compileReadme } = await import('./compileReadme.mjs')
const { addToReadme, readmeTemplate } = await import('./partials.mjs')

const gulpConfig = await import('../gulp.config.mjs')

describe('compileReadme', () => {
  test('calls readmeTemplate and addToReadme', done => {
    expect.assertions(2)
    // A file to document (this repo's own src has none matching the default readme.from)
    gulpConfig.set('readme.from', 'functions/compileReadme.mjs')
    compileReadme()
    setTimeout(() => {
      gulpConfig.set('readme.from', 'src/**/!(*.test).js')
      expect(readmeTemplate).toHaveBeenCalled()
      expect(addToReadme).toHaveBeenCalled()
      done()
    }, 500)
  })

  test('leaves the readme alone, with a warning, when no file matches readme.from or readme.fromEsm', async () => {
    readmeTemplate.mockClear()
    addToReadme.mockClear()
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    gulpConfig.set('readme.from', 'no-such-folder/**/*.js')
    gulpConfig.set('readme.fromEsm', [])
    try {
      const done = jest.fn()
      await compileReadme(done)
      expect(done).toHaveBeenCalled()
      expect(readmeTemplate).not.toHaveBeenCalled()
      expect(addToReadme).not.toHaveBeenCalled()
      expect(warn.mock.calls[0][0]).toMatch(/No files match readme.from \(no-such-folder\/\*\*\/\*\.js\): .*README\.md was left as it is/)
    } finally {
      gulpConfig.set('readme.from', 'src/**/!(*.test).js')
      warn.mockRestore()
    }
  })

  test('readme.fromEsm files alone are enough to generate it', done => {
    readmeTemplate.mockClear()
    addToReadme.mockClear()
    gulpConfig.set('readme.from', 'no-such-folder/**/*.js')
    gulpConfig.set('readme.fromEsm', ['functions/compileReadme.mjs'])
    compileReadme()
    setTimeout(() => {
      gulpConfig.set('readme.from', 'src/**/!(*.test).js')
      gulpConfig.set('readme.fromEsm', [])
      expect(readmeTemplate).toHaveBeenCalled()
      expect(addToReadme).toHaveBeenCalled()
      done()
    }, 500)
  })

  test('does nothing when readme.enabled is false', async () => {
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
