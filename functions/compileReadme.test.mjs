import { jest } from '@jest/globals'

const genericFunction = () => Promise.resolve(true)
jest.unstable_mockModule('./partials/addToReadme.mjs', () => ({ addToReadme: jest.fn(genericFunction) }))
jest.unstable_mockModule('./partials/readmeTemplate.mjs', () => ({ readmeTemplate: jest.fn(genericFunction) }))

const { compileReadme } = await import('./compileReadme.mjs')
const { addToReadme, readmeTemplate } = await import('./partials.mjs')

const gulpConfig = await import('../gulp.config.mjs')

describe('compileReadme', () => {
  // Off by default; this project's own build-tools.config.json turns it on, but don't depend on that
  beforeEach(() => gulpConfig.set('readme.enabled', true))

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

  test.each([false, undefined])('does nothing, and says so, when readme.enabled is %s', async enabled => {
    readmeTemplate.mockClear()
    addToReadme.mockClear()
    const info = jest.spyOn(console, 'info').mockImplementation(() => {})
    gulpConfig.set('readme.enabled', enabled)
    try {
      const done = jest.fn()
      await compileReadme(done)
      expect(done).toHaveBeenCalled()
      expect(readmeTemplate).not.toHaveBeenCalled()
      expect(addToReadme).not.toHaveBeenCalled()
      expect(info).toHaveBeenCalledWith(expect.stringContaining('readme.enabled is off'))
    } finally {
      info.mockRestore()
    }
  })
})
