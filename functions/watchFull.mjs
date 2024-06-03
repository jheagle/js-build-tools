import { beginWatcher, runOnChange } from './partials.mjs'

/**
 * Watch for changes and run the distribution for the changed files, then bundle and test the changed files.
 * @memberOf module:js-build-tools
 * @returns {FSWatcher}
 */
export const watchFull = () => beginWatcher()
  .on('change', runOnChange)
