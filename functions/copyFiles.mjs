import { dest, src } from 'gulp'
import * as gulpConfig from '../gulp.config.mjs'

/**
 * Copy files from one place to another - any number of { from, to, base? } entries, configured via copyFiles.
 * A project with no copyFiles entries gets a task that does nothing. Meant to be run explicitly (its own script,
 * e.g. `gulp copyFiles`), not folded into the default build - a bundle (or any other file this copies) is often
 * the live, publicly-reachable version of something, so publishing it elsewhere should be a deliberate step, not
 * a side effect of every routine local build.
 *
 * Each entry runs as its own independent src().pipe(dest()), awaited via Promise.all rather than merged into one
 * combined stream (mergeStream, the pattern bundle.mjs uses) - that pattern assumes every merged stream ends up
 * at the same shared destination; here, each entry can have a genuinely different one, and merging streams that
 * each already terminate at their own separate dest() hit a real "write after end" error in practice.
 * @memberOf module:js-build-tools
 * @returns {Promise<void>}
 */
export const copyFiles = () => {
  const copies = gulpConfig.get('copyFiles', [])
  if (!copies.length) {
    return Promise.resolve()
  }
  return Promise.all(copies.map(({ from, to, base }) => new Promise((resolve, reject) => {
    src(from, base ? { base } : {})
      .pipe(dest(to))
      .on('finish', resolve)
      .on('error', reject)
  }))).then(() => {})
}
