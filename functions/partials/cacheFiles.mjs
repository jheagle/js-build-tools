import { createHash, randomUUID } from 'crypto'
import { mkdir, readFile, rename, writeFile } from 'fs/promises'
import path from 'path'
import { Transform } from 'stream'

/**
 * The cache file for a file's contents: a hash of the cache name and the contents, so the same image with different
 * plugin settings (the name) gets a result of its own.
 * @private
 * @param {string} directory
 * @param {string} name
 * @param {Buffer} contents
 * @returns {string}
 */
const cachePath = (directory, name, contents) => path.join(
  directory,
  name,
  createHash('sha256').update(name).update('\0').update(contents).digest('hex')
)

/**
 * Write through a temporary file and rename it, so a reader (another build or test worker) never sees a half-written
 * result.
 * @private
 * @param {string} file
 * @param {Buffer} contents
 * @returns {Promise<void>}
 */
const writeAtomic = async (file, contents) => {
  await mkdir(path.dirname(file), { recursive: true })
  const temporary = `${file}.${randomUUID()}.tmp`
  await writeFile(temporary, contents)
  await rename(temporary, file)
}

/**
 * Run a gulp plugin only on files it hasn't processed before. A file whose contents (with this cache name) were
 * processed by an earlier run gets that run's result from the cache instead, and skips the plugin. Replaces
 * gulp-cache, which kept one cache for every process in the system's temp folder.
 * @memberOf module:partials
 * @param {stream.Transform} plugin - The gulp plugin stream to run on uncached files (e.g. imagemin()).
 * @param {Object} options
 * @param {string} options.directory - Where cached results are kept (see images.cacheDir).
 * @param {string} [options.name='default'] - Keeps results of different plugin settings apart.
 * @returns {stream.Transform}
 */
export const cacheFiles = (plugin, { directory, name = 'default' }) => {
  // The cache file of each file sent to the plugin, by path: the plugin passes the files it was given back out
  const pending = new Map()
  const writes = []
  const pluginDone = new Promise((resolve, reject) => {
    plugin.on('end', resolve)
    plugin.on('error', reject)
  })
  // The error also reaches the stream (below); this only stops it from being reported a second time as unhandled
  pluginDone.catch(() => {})

  const stream = new Transform({
    objectMode: true,
    transform (file, encoding, callback) {
      if (!file.isBuffer()) {
        callback(null, file)
        return
      }
      const cached = cachePath(directory, name, file.contents)
      readFile(cached).then(
        contents => {
          file.contents = contents
          callback(null, file)
        },
        () => {
          pending.set(file.path, cached)
          plugin.write(file)
          callback()
        }
      )
    },
    flush (callback) {
      plugin.end()
      pluginDone
        .then(() => Promise.all(writes))
        .then(() => callback(), callback)
    }
  })

  plugin.on('data', file => {
    const cached = pending.get(file.path)
    if (cached && file.isBuffer()) {
      // The cache only saves time: a result that can't be written is processed again next run, not a failed build
      writes.push(writeAtomic(cached, file.contents).catch(() => {}))
    }
    stream.push(file)
  })
  plugin.on('error', error => stream.destroy(error))

  return stream
}
