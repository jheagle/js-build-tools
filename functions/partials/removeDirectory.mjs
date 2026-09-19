import { access, rm } from 'node:fs/promises'
import { setTimeout as sleep } from 'node:timers/promises'

const attempts = 4

const exists = dirPath => access(dirPath).then(() => true, () => false)

/**
 * Delete a directory and everything in it, resolving only once it is really gone.
 *
 * A single rm can leave a directory behind - most often when something is still writing into it (a build task, a
 * watcher, a dev server) or has it briefly locked (EBUSY/EPERM/ENOTEMPTY) - which silently leaves stale output for
 * the next build. So: Node's own retry-with-back-off handles the transient errors, then the directory is checked and
 * removed again if it was recreated, and a clear error is raised rather than carrying on with stale output.
 * @memberOf module:partials
 * @param {string} dirPath
 * @returns {Promise<string>} Resolves with dirPath once the directory no longer exists (or already didn't).
 * @throws {Error} If the directory still exists after several attempts.
 */
export const removeDirectory = async dirPath => {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    await rm(dirPath, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
    if (!await exists(dirPath)) {
      return dirPath
    }
    if (attempt < attempts) {
      await sleep(200 * attempt)
    }
  }
  throw new Error(
    `Unable to remove "${dirPath}" - it was recreated or is locked. Stop anything that has it open or is writing ` +
    'into it (watchers, dev servers, editors, other build tasks) and try again.'
  )
}
