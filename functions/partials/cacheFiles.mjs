import { createHash, randomUUID } from 'crypto'
import { mkdir, readFile, rename, writeFile } from 'fs/promises'
import path from 'path'
import { Transform } from 'stream'

// Marks a file sent to the plugin with its cache file and its path, so its result is cached even if the plugin renames it
const cacheFile = Symbol('cacheFile')

/**
 * The cache file for a file's contents: a hash of the cache name, the fingerprint and the contents, so the same file
 * with other plugin settings or plugin versions gets a result of its own.
 * @private
 * @param {string} directory
 * @param {string} name
 * @param {string} fingerprint
 * @param {Buffer} contents
 * @returns {string}
 */
const cachePath = (directory, name, fingerprint, contents) => path.join(
  directory,
  name,
  createHash('sha256').update(name).update('\0').update(fingerprint).update('\0').update(contents).digest('hex')
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
 * Run a gulp plugin only on files it hasn't processed before. A file whose contents (with this cache name and
 * fingerprint) were processed by an earlier run gets that run's result from the cache instead, and skips the plugin.
 * Replaces gulp-cache, which kept one cache for every process in the system's temp folder.
 *
 * A result is cached when the plugin passes on the file object it was given (as gulp plugins usually do); a plugin
 * that makes new file objects still works, its results just aren't cached. When the plugin renames a file, the cache
 * keeps the new name too (next to the result, as `<entry>.path`), so a cached file is renamed the same way. Entries
 * are never pruned: delete the directory to start over.
 * @memberOf module:partials
 * @param {stream.Transform} plugin - The gulp plugin stream to run on uncached files (e.g. imagemin()).
 * @param {Object} options
 * @param {string} options.directory - Where cached results are kept (see images.cacheDir).
 * @param {string} [options.name='default'] - The cache's folder; keeps results of different plugin settings apart.
 * @param {string} [options.fingerprint=''] - Anything else that changes the plugin's output, such as its version and
 * options: when it changes, earlier results are no longer used.
 * @returns {stream.Transform}
 */
export const cacheFiles = (plugin, { directory, name = 'default', fingerprint = '' }) => {
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
      const cached = cachePath(directory, name, fingerprint, file.contents)
      readFile(cached).then(
        async contents => {
          file.contents = contents
          // Written before the result, so it's there whenever the result is
          const renamed = await readFile(`${cached}.path`, 'utf8').catch(() => undefined)
          if (renamed !== undefined) {
            file.path = path.join(path.dirname(file.path), renamed)
          }
          callback(null, file)
        },
        () => {
          file[cacheFile] = { cached, from: file.path }
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
    const tag = file[cacheFile]
    delete file[cacheFile]
    if (tag && file.isBuffer()) {
      const { cached, from } = tag
      const renamed = file.path === from ? Promise.resolve() : writeAtomic(`${cached}.path`, path.relative(path.dirname(from), file.path))
      // The cache only saves time: a result that can't be written is processed again next run, not a failed build
      writes.push(renamed.then(() => writeAtomic(cached, file.contents)).catch(() => {}))
    }
    stream.push(file)
  })
  plugin.on('error', error => stream.destroy(error))

  return stream
}
