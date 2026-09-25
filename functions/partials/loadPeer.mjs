import { createRequire } from 'node:module'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

// Several dependencies ship ESM-only (standard, gulp-ts-compile, typedoc), but this package also publishes a CommonJS
// build (dist/*.js) whose babel transform would turn even a dynamic import() into a require() that cannot load an ES
// module. Hiding the import() inside a Function constructor keeps it a genuine dynamic import that works from either
// build, because babel cannot see (and so cannot rewrite) an import expression which only exists as a runtime string.
const dynamicImport = new Function('specifier', 'return import(specifier)')

/**
 * Import an ES module (or any module) with a real dynamic import(), whichever build (ESM or CommonJS) this runs from.
 * @memberOf module:partials
 * @param {string} specifier - The package name, or the URL of a file.
 * @returns {Promise<Object>} The module namespace.
 */
export const importModule = specifier => dynamicImport(specifier)

const isMissing = (error, name) => error.code === 'MODULE_NOT_FOUND' && error.message.includes(`'${name}'`)

const notInstalled = (name, { task, installHint }) => new Error(
  `The ${task} task needs the optional peer dependency ${name}, which is not installed. ${installHint}`
)

/**
 * Load an optional peer dependency (one which is only needed once a task runs, so projects which never use that task
 * do not have to install it) with require(), from the project being built rather than from this package. When it is
 * missing the error explains how to install it.
 * @memberOf module:partials
 * @param {string} name - The package name.
 * @param {Object} options
 * @param {string} options.task - The task which needs the package, for the error message.
 * @param {string} options.installHint - How to install it, for the error message.
 * @param {string} [options.esmOnlyMessage] - The error message when the package turns out to be ESM-only (it cannot be require()d).
 * @param {string} [options.projectPath=process.cwd()] - The folder of the project (which has the package.json) being built.
 * @returns {*} Whatever the package exports.
 * @throws {Error} With install instructions when the package is not installed.
 */
export const requirePeer = (name, { task, installHint, esmOnlyMessage, projectPath = process.cwd() }) => {
  try {
    return createRequire(path.join(projectPath, 'package.json'))(name)
  } catch (error) {
    if (isMissing(error, name)) {
      throw notInstalled(name, { task, installHint })
    }
    if (error.code === 'ERR_REQUIRE_ESM' && esmOnlyMessage) {
      throw new Error(esmOnlyMessage)
    }
    throw error
  }
}

/**
 * Import an optional peer dependency which ships ESM-only, from the project being built. See {@link requirePeer}.
 * @memberOf module:partials
 * @param {string} name - The package name.
 * @param {Object} options
 * @param {string} options.task - The task which needs the package, for the error message.
 * @param {string} options.installHint - How to install it, for the error message.
 * @param {string} [options.projectPath=process.cwd()] - The folder of the project (which has the package.json) being built.
 * @returns {Promise<Object>} The module namespace.
 * @throws {Error} With install instructions when the package is not installed.
 */
export const importPeer = async (name, { task, installHint, projectPath = process.cwd() }) => {
  let resolved
  try {
    resolved = createRequire(path.join(projectPath, 'package.json')).resolve(name)
  } catch (error) {
    if (isMissing(error, name)) {
      throw notInstalled(name, { task, installHint })
    }
    throw error
  }
  return importModule(pathToFileURL(resolved).href)
}
