import fs from 'fs'
import path from 'path'
import { Readable, Transform } from 'stream'
import * as setUp from '../test-helpers/setUp.mjs'
import { cacheFiles } from './cacheFiles.mjs'

setUp.setDefaults('test-cache-files')
const gulpConfig = setUp.gulpConfig

beforeEach(setUp.beforeEach)

afterEach(setUp.afterEach)

// Just enough of a Vinyl file for cacheFiles and the fake plugin
const file = (filePath, text) => ({
  path: filePath,
  contents: text === null ? null : Buffer.from(text),
  isBuffer () {
    return Buffer.isBuffer(this.contents)
  }
})

// A plugin that upper-cases each file, counting the files it's given
const upperCase = () => {
  const plugin = new Transform({
    objectMode: true,
    transform (input, encoding, callback) {
      plugin.calls++
      input.contents = Buffer.from(input.contents.toString().toUpperCase())
      callback(null, input)
    }
  })
  plugin.calls = 0
  return plugin
}

// Run files through cacheFiles and collect what comes out, as text by path
const run = (files, plugin, options) => new Promise((resolve, reject) => {
  const out = {}
  Readable.from(files)
    .pipe(cacheFiles(plugin, options))
    .on('data', output => {
      out[path.basename(output.path)] = output.contents === null ? null : output.contents.toString()
    })
    .on('end', () => resolve(out))
    .on('error', reject)
})

const cacheDir = () => `${gulpConfig.get('rootPath')}cache`

describe('cacheFiles', () => {
  test('a file it hasn\'t seen goes through the plugin, and the result is cached', async () => {
    const plugin = upperCase()
    expect(await run([file('/a.txt', 'one'), file('/b.txt', 'two')], plugin, { directory: cacheDir() }))
      .toEqual({ 'a.txt': 'ONE', 'b.txt': 'TWO' })
    expect(plugin.calls).toBe(2)
    expect(fs.readdirSync(path.join(cacheDir(), 'default'))).toHaveLength(2)
  })

  test('the same contents again come from the cache, without the plugin', async () => {
    await run([file('/a.txt', 'one')], upperCase(), { directory: cacheDir() })
    const plugin = upperCase()
    // Another path with the same contents is the same result
    expect(await run([file('/a.txt', 'one'), file('/copy.txt', 'one')], plugin, { directory: cacheDir() }))
      .toEqual({ 'a.txt': 'ONE', 'copy.txt': 'ONE' })
    expect(plugin.calls).toBe(0)
  })

  test('changed contents, or another cache name, go through the plugin again', async () => {
    await run([file('/a.txt', 'one')], upperCase(), { directory: cacheDir() })
    const changed = upperCase()
    expect(await run([file('/a.txt', 'one!')], changed, { directory: cacheDir() })).toEqual({ 'a.txt': 'ONE!' })
    expect(changed.calls).toBe(1)
    const otherName = upperCase()
    expect(await run([file('/a.txt', 'one')], otherName, { directory: cacheDir(), name: 'other' })).toEqual({ 'a.txt': 'ONE' })
    expect(otherName.calls).toBe(1)
  })

  test('another fingerprint (say, a new plugin version) goes through the plugin again', async () => {
    await run([file('/a.txt', 'one')], upperCase(), { directory: cacheDir(), fingerprint: 'v1' })
    const sameVersion = upperCase()
    await run([file('/a.txt', 'one')], sameVersion, { directory: cacheDir(), fingerprint: 'v1' })
    expect(sameVersion.calls).toBe(0)
    const newVersion = upperCase()
    await run([file('/a.txt', 'one')], newVersion, { directory: cacheDir(), fingerprint: 'v2' })
    expect(newVersion.calls).toBe(1)
  })

  test('a plugin that renames files has its results cached, and a cached file is renamed the same way', async () => {
    const renaming = () => {
      const plugin = upperCase()
      const transform = plugin._transform.bind(plugin)
      plugin._transform = (input, encoding, callback) => transform(input, encoding, (error, output) => {
        output.path = output.path.replace('.txt', '.md')
        callback(error, output)
      })
      return plugin
    }
    expect(await run([file('/a.txt', 'one')], renaming(), { directory: cacheDir() })).toEqual({ 'a.md': 'ONE' })
    const again = renaming()
    // From the cache, renamed the same way, without the plugin
    expect(await run([file('/a.txt', 'one')], again, { directory: cacheDir() })).toEqual({ 'a.md': 'ONE' })
    expect(again.calls).toBe(0)
  })

  test('a plugin that makes new file objects still works; its results just aren\'t cached', async () => {
    const copying = new Transform({
      objectMode: true,
      transform (input, encoding, callback) {
        callback(null, file(input.path, input.contents.toString().toUpperCase()))
      }
    })
    expect(await run([file('/a.txt', 'one')], copying, { directory: cacheDir() })).toEqual({ 'a.txt': 'ONE' })
    expect(fs.existsSync(path.join(cacheDir(), 'default'))).toBe(false)
  })

  test('a file without contents (a directory) passes straight through', async () => {
    const plugin = upperCase()
    expect(await run([file('/folder', null)], plugin, { directory: cacheDir() })).toEqual({ folder: null })
    expect(plugin.calls).toBe(0)
  })

  test('a cache that can\'t be written still gives the plugin\'s results', async () => {
    // A file where the cache directory should be: nothing can be written inside it
    fs.writeFileSync(cacheDir(), 'not a directory')
    const plugin = upperCase()
    expect(await run([file('/a.txt', 'one')], plugin, { directory: cacheDir() })).toEqual({ 'a.txt': 'ONE' })
    expect(plugin.calls).toBe(1)
  })

  test('two runs at once into the same cache both get every result (the cache file is written whole)', async () => {
    const files = () => Array.from({ length: 20 }, (_, index) => file(`/f${index}.txt`, `file ${index}`))
    const expected = Object.fromEntries(Array.from({ length: 20 }, (_, index) => [`f${index}.txt`, `FILE ${index}`]))
    const results = await Promise.all([
      run(files(), upperCase(), { directory: cacheDir() }),
      run(files(), upperCase(), { directory: cacheDir() })
    ])
    expect(results).toEqual([expected, expected])
    expect(fs.readdirSync(path.join(cacheDir(), 'default')).filter(name => name.endsWith('.tmp'))).toEqual([])
  })

  test('a plugin error fails the stream', async () => {
    const failing = new Transform({
      objectMode: true,
      transform (input, encoding, callback) {
        callback(new Error('plugin failed'))
      }
    })
    await expect(run([file('/a.txt', 'one')], failing, { directory: cacheDir() })).rejects.toThrow('plugin failed')
  })
})
