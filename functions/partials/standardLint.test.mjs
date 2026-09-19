import Vinyl from 'vinyl'
import { Readable } from 'node:stream'
import { standardLint } from './standardLint.mjs'

const makeFile = (contents, filePath = '/project/dist/example.js') => new Vinyl({
  cwd: '/project',
  base: '/project/dist',
  path: filePath,
  contents
})

const run = (transform, files) => new Promise((resolve, reject) => {
  const out = []
  transform.on('data', file => out.push(file)).on('end', () => resolve(out)).on('error', reject)
  files.forEach(file => transform.write(file))
  transform.end()
})

const fakeStandard = (resultFor) => ({
  lintText: jest.fn((text, options) => Promise.resolve(resultFor(text, options)))
})

let logSpy

beforeEach(() => {
  logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  logSpy.mockRestore()
})

describe('standardLint', () => {
  test('replaces file contents with the fixed output and hands Standard the file path, cwd and fix option', async () => {
    expect.assertions(3)
    const standard = fakeStandard((text) => [{ messages: [], errorCount: 0, warningCount: 0, output: text.replace(/"/g, '\'') }])
    const [linted] = await run(standardLint({ fix: true }, () => Promise.resolve(standard)), [makeFile(Buffer.from('const a = "b"'))])
    expect(linted.contents.toString()).toEqual('const a = \'b\'')
    expect(standard.lintText).toHaveBeenCalledWith('const a = "b"', { filename: '/project/dist/example.js', cwd: '/project', fix: true })
    expect(linted.path).toEqual('/project/dist/example.js')
  })

  test('leaves the contents alone when Standard has no fixed output (nothing needed fixing)', async () => {
    expect.assertions(1)
    const standard = fakeStandard(() => [{ messages: [], errorCount: 0, warningCount: 0 }])
    const [linted] = await run(standardLint({}, () => Promise.resolve(standard)), [makeFile(Buffer.from('const a = 1'))])
    expect(linted.contents.toString()).toEqual('const a = 1')
  })

  test('passes fix: false through so nothing is rewritten', async () => {
    expect.assertions(1)
    const standard = fakeStandard(() => [{ messages: [], errorCount: 0, warningCount: 0 }])
    await run(standardLint({ fix: false }, () => Promise.resolve(standard)), [makeFile(Buffer.from('x'))])
    expect(standard.lintText.mock.calls[0][1].fix).toBe(false)
  })

  test('passes a file through untouched when the project ignores it (Standard returns no results)', async () => {
    expect.assertions(2)
    const standard = fakeStandard(() => [])
    const [linted] = await run(standardLint({}, () => Promise.resolve(standard)), [makeFile(Buffer.from('var x=1'))])
    expect(linted.contents.toString()).toEqual('var x=1')
    expect(logSpy).toHaveBeenCalledWith('✖ Errors total: 0')
  })

  test('skips null-content files without linting them', async () => {
    expect.assertions(2)
    const standard = fakeStandard(() => [])
    const [passed] = await run(standardLint({}, () => Promise.resolve(standard)), [makeFile(null)])
    expect(passed.isNull()).toBeTruthy()
    expect(standard.lintText).not.toHaveBeenCalled()
  })

  test('errors on streaming file contents, which cannot be linted', async () => {
    expect.assertions(1)
    const streamFile = makeFile(Readable.from(['x']))
    await expect(run(standardLint({}, () => Promise.resolve(fakeStandard(() => []))), [streamFile])).rejects.toThrow(/streaming/)
  })

  test('prints per-file problems and a summary of totals across all files, without failing', async () => {
    expect.assertions(5)
    const standard = fakeStandard((text, { filename }) => filename.endsWith('a.js')
      ? [{ messages: [{ line: 2, column: 7, message: 'unused b' }, { line: 3, column: 1, message: 'bad thing' }], errorCount: 2, warningCount: 0 }]
      : [{ messages: [{ line: 1, column: 1, message: 'just a warning' }], errorCount: 0, warningCount: 1 }])
    const out = await run(
      standardLint({}, () => Promise.resolve(standard)),
      [makeFile(Buffer.from('a'), '/project/dist/a.js'), makeFile(Buffer.from('b'), '/project/dist/b.js')]
    )
    expect(out).toHaveLength(2)
    expect(logSpy).toHaveBeenCalledWith('dist/a.js')
    expect(logSpy).toHaveBeenCalledWith('line 2:7\tunused b')
    expect(logSpy).toHaveBeenCalledWith('✖ Errors total: 2')
    expect(logSpy).toHaveBeenCalledWith('⚠ Warnings total: 1\n')
  })

  test('surfaces a failure to load or run Standard as a stream error', async () => {
    expect.assertions(1)
    await expect(run(standardLint({}, () => Promise.reject(new Error('cannot load'))), [makeFile(Buffer.from('x'))])).rejects.toThrow('cannot load')
  })
})
