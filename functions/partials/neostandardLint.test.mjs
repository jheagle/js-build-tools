import Vinyl from 'vinyl'
import { Readable } from 'node:stream'
import { neostandardLint } from './neostandardLint.mjs'

const makeFile = (contents, filePath = '/project/src/example.js') => new Vinyl({
  cwd: '/project',
  base: '/project/src',
  path: filePath,
  contents
})

const run = (transform, files) => new Promise((resolve, reject) => {
  const out = []
  transform.on('data', file => out.push(file)).on('end', () => resolve(out)).on('error', reject)
  files.forEach(file => transform.write(file))
  transform.end()
})

const fakeEslint = (resultFor) => ({
  lintText: jest.fn((text, options) => Promise.resolve(resultFor(text, options)))
})

let logSpy

beforeEach(() => {
  logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  logSpy.mockRestore()
})

describe('neostandardLint', () => {
  test('replaces file contents with the fixed output and hands ESLint the file path', async () => {
    expect.assertions(3)
    const eslint = fakeEslint((text) => [{ messages: [], errorCount: 0, warningCount: 0, output: text.replace(/"/g, '\'') }])
    const [linted] = await run(neostandardLint({ fix: true }, () => Promise.resolve(eslint)), [makeFile(Buffer.from('const a = "b"'))])
    expect(linted.contents.toString()).toEqual('const a = \'b\'')
    expect(eslint.lintText).toHaveBeenCalledWith('const a = "b"', { filePath: '/project/src/example.js' })
    expect(linted.path).toEqual('/project/src/example.js')
  })

  test('leaves the contents alone when ESLint has no fixed output (nothing needed fixing)', async () => {
    expect.assertions(1)
    const eslint = fakeEslint(() => [{ messages: [], errorCount: 0, warningCount: 0 }])
    const [linted] = await run(neostandardLint({}, () => Promise.resolve(eslint)), [makeFile(Buffer.from('const a = 1'))])
    expect(linted.contents.toString()).toEqual('const a = 1')
  })

  test('builds the linter once per stream, from the first file, and reuses it for the rest', async () => {
    expect.assertions(1)
    const loadEslint = jest.fn(() => Promise.resolve(fakeEslint(() => [{ messages: [], errorCount: 0, warningCount: 0 }])))
    await run(
      neostandardLint({}, loadEslint),
      [makeFile(Buffer.from('a'), '/project/src/a.js'), makeFile(Buffer.from('b'), '/project/src/b.js')]
    )
    expect(loadEslint).toHaveBeenCalledTimes(1)
  })

  test('passes fix and ts through to the loader', async () => {
    expect.assertions(1)
    const loadEslint = jest.fn(() => Promise.resolve(fakeEslint(() => [{ messages: [], errorCount: 0, warningCount: 0 }])))
    await run(neostandardLint({ fix: false, ts: true }, loadEslint), [makeFile(Buffer.from('x'))])
    expect(loadEslint).toHaveBeenCalledWith({ cwd: '/project', ts: true, fix: false })
  })

  test('passes a file through untouched when the project ignores it (ESLint returns no results)', async () => {
    expect.assertions(2)
    const eslint = fakeEslint(() => [])
    const [linted] = await run(neostandardLint({}, () => Promise.resolve(eslint)), [makeFile(Buffer.from('var x=1'))])
    expect(linted.contents.toString()).toEqual('var x=1')
    expect(logSpy).toHaveBeenCalledWith('✖ Errors total: 0')
  })

  test('skips null-content files without linting them', async () => {
    expect.assertions(2)
    const eslint = fakeEslint(() => [])
    const [passed] = await run(neostandardLint({}, () => Promise.resolve(eslint)), [makeFile(null)])
    expect(passed.isNull()).toBeTruthy()
    expect(eslint.lintText).not.toHaveBeenCalled()
  })

  test('errors on streaming file contents, which cannot be linted', async () => {
    expect.assertions(1)
    const streamFile = makeFile(Readable.from(['x']))
    await expect(run(neostandardLint({}, () => Promise.resolve(fakeEslint(() => []))), [streamFile])).rejects.toThrow(/streaming/)
  })

  test('prints per-file problems and a summary of totals across all files, without failing', async () => {
    expect.assertions(5)
    const eslint = fakeEslint((text, { filePath }) => filePath.endsWith('a.js')
      ? [{ messages: [{ line: 2, column: 7, message: 'unused b' }, { line: 3, column: 1, message: 'bad thing' }], errorCount: 2, warningCount: 0 }]
      : [{ messages: [{ line: 1, column: 1, message: 'just a warning' }], errorCount: 0, warningCount: 1 }])
    const out = await run(
      neostandardLint({}, () => Promise.resolve(eslint)),
      [makeFile(Buffer.from('a'), '/project/src/a.js'), makeFile(Buffer.from('b'), '/project/src/b.js')]
    )
    expect(out).toHaveLength(2)
    expect(logSpy).toHaveBeenCalledWith('src/a.js')
    expect(logSpy).toHaveBeenCalledWith('line 2:7\tunused b')
    expect(logSpy).toHaveBeenCalledWith('✖ Errors total: 2')
    expect(logSpy).toHaveBeenCalledWith('⚠ Warnings total: 1\n')
  })

  test('surfaces a failure to load or run the linter as a stream error', async () => {
    expect.assertions(1)
    await expect(run(neostandardLint({}, () => Promise.reject(new Error('cannot load'))), [makeFile(Buffer.from('x'))])).rejects.toThrow('cannot load')
  })
})
