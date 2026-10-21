import cache from 'gulp-cache'

/**
 * Give this test file its own gulp-cache folder, and return a function that clears only that folder. gulp-cache
 * otherwise keeps one cache in os.tmpdir() for every process, so a cache.clearAll() in one Jest worker could wipe it
 * while another worker's images task was still using it, and gulp-cache then silently dropped that worker's
 * images. Jest loads gulp-cache separately for each test file, so this only changes the copy that file uses.
 * @memberOf module:testHelpers
 * @param {string} name - Unique per test file, used in the cache folder name.
 * @returns {function(): Promise<void>} Clears this test file's cache.
 */
export const isolateGulpCache = name => {
  const fileCache = new cache.Cache({ cacheDirName: `js-build-tools-test-${name}` })
  cache.defaultOptions.fileCache = fileCache
  return () => new Promise((resolve, reject) => fileCache.clear(null, error => error ? reject(error) : resolve()))
}
