import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import * as gulpConfig from '../../gulp.config.mjs'
import { removeDirectory } from './removeDirectory.mjs'
// jsdoc.base.js is CommonJS (it's also required directly by consuming projects' own .jsdoc.conf.js) - Node's ESM
// loader imports a CJS module's module.exports as the default export directly, no createRequire/import.meta needed
// (import.meta.url tripped up this project's own Babel CJS transform, which Jest relies on to run .mjs test files -
// confirmed by removing it and nothing else changing).
import jsdocBase from '../../jsdoc.base.js'

const execFileAsync = promisify(execFile)

const escapeHtml = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const jsdocInstallHint = 'Install it in your project with: npm install --save-dev jsdoc'
const themeInstallHint = name => `Install it in your project with: npm install --save-dev ${name}`

/**
 * Resolve the installed directory of an optional peer dependency, from the project being built rather than from
 * this package. Deliberately not requirePeer/importPeer's own `require(name + '/package.json')` approach - that
 * breaks for any package whose own package.json restricts its exports map and does not expose that subpath
 * (clean-jsdoc-theme does; confirmed live, not assumed - resolving its own package.json throws
 * ERR_PACKAGE_PATH_NOT_EXPORTED in plain Node, and a differently-shaped MODULE_NOT_FOUND under Jest's own
 * resolver, which still is not "not installed" either way). Walking Node's own real module-lookup directories
 * (require.resolve.paths) and checking each on disk sidesteps the exports map entirely - this only ever reads
 * whether `<dir>/<name>/package.json` exists, never asks the module system to resolve a restricted subpath.
 * @memberOf module:partials
 * @param {string} name - The package name.
 * @param {Object} options
 * @param {string} options.task
 * @param {string} options.installHint
 * @param {string} [options.projectPath=process.cwd()]
 * @returns {string}
 * @throws {Error} With install instructions when the package is not installed.
 */
const resolvePeerDir = (name, { task, installHint, projectPath = process.cwd() }) => {
  const req = createRequire(path.join(projectPath, 'package.json'))
  const found = (req.resolve.paths(name) || [])
    .map(dir => path.join(dir, name))
    .find(dir => fs.existsSync(path.join(dir, 'package.json')))
  if (!found) {
    throw new Error(`The ${task} task needs the optional peer dependency ${name}, which is not installed. ${installHint}`)
  }
  return found
}

/**
 * Resolve jsdoc's own CLI entry point. jsdoc has no stable programmatic Node API for generating HTML docs (unlike
 * TypeDoc's Application.bootstrap()/convert()/generateDocs()) - gulp-jsdoc3, the established gulp wrapper, is
 * stale, and its own README admits jsdoc does not support piped input in the first place, a real anti-pattern for
 * this project's own gulp-stream conventions. Running its real CLI via child_process is the portable way in -
 * confirmed via `npm view jsdoc bin`, which reports "jsdoc.js" at the package root.
 * @memberOf module:partials
 * @param {string} [projectPath=process.cwd()]
 * @returns {string}
 */
export const resolveJsdocBin = (projectPath = process.cwd()) =>
  path.join(resolvePeerDir('jsdoc', { task: 'docs', installHint: jsdocInstallHint, projectPath }), 'jsdoc.js')

/**
 * Resolve a jsdoc theme package's own template directory, for jsdoc's own opts.template config key: the folder
 * holding its publish.js. That is the package root for a classic jsdoc template (clean-jsdoc-theme 4.x included),
 * but `dist` for a bundled one (clean-jsdoc-theme 5.x).
 * @memberOf module:partials
 * @param {string} name
 * @param {string} [projectPath=process.cwd()]
 * @returns {string}
 */
export const resolveJsdocTheme = (name, projectPath = process.cwd()) => {
  const packageDir = resolvePeerDir(name, { task: 'docs', installHint: themeInstallHint(name), projectPath })
  const distDir = path.join(packageDir, 'dist')
  return fs.existsSync(path.join(distDir, 'publish.js')) ? distDir : packageDir
}

/**
 * Generate the HTML documentation of a plain-JavaScript project with jsdoc, using jsdoc.base.js's own shared
 * config (plugins, includePattern/excludePattern) as the starting point rather than a parallel one - the same
 * base a project's own .jsdoc.conf.js has always been able to extend, just with source.include and the output
 * options generated here instead of hand-maintained per project. Configure this with 'docs.from', 'docs.to',
 * 'docs.index', 'docs.theme' and 'docs.title'.
 * @memberOf module:partials
 * @param {string|Array<string>} [srcPath=gulpConfig.get('docs.from')] - The directory (or directories and files) holding
 * the JS source.
 * @param {string} [outPath=gulpConfig.get('docs.to')] - The directory the documentation is generated into (cleared first).
 * @param {function(string, Array<string>): Promise<Object>} [runJsdoc] - Runs the jsdoc CLI, tests can inject a stand-in.
 * @returns {Function} A gulp task, it accepts an optional callback and returns a promise.
 */
export const jsdocDocsFor = (
  srcPath = gulpConfig.get('docs.from'),
  outPath = gulpConfig.get('docs.to'),
  runJsdoc = (bin, args) => execFileAsync(process.execPath, [bin, ...args])
) => {
  if (gulpConfig.get('docs.enabled') === false) {
    return () => {}
  }
  return (done) => {
    const generate = async () => {
      const theme = gulpConfig.get('docs.theme') || 'clean-jsdoc-theme'
      const themeDir = resolveJsdocTheme(theme)
      const indexFile = gulpConfig.get('docs.index')
      const title = gulpConfig.get('docs.title')
      await removeDirectory(outPath)
      const config = {
        ...jsdocBase,
        source: {
          ...jsdocBase.source,
          include: [].concat(srcPath).map(includePath => path.resolve(includePath))
        },
        opts: {
          destination: path.resolve(outPath),
          // jsdoc does not recurse into source.include's own subdirectories by default - without this, only
          // the top level of docs.from would ever be scanned. Confirmed from clean-jsdoc-theme's own README
          // quick-start example, which sets this explicitly, not assumed from jsdoc's own classic defaults.
          recurse: true,
          template: themeDir,
          // clean-jsdoc-theme's own options for the name in its header and the home page's <title> (otherwise "Home").
          // The header is given as a link: a plain-text title links to the site root ("/"), while every page is in one
          // folder, so index.html is the home page wherever they are served. Both are printed unescaped by the theme.
          ...(title
            ? {
                theme_opts: {
                  title: `<a href="index.html" class="sidebar-title sidebar-title-anchor">${escapeHtml(title)}</a>`,
                  homepageTitle: escapeHtml(title)
                }
              }
            : {}),
          ...(indexFile && fs.existsSync(indexFile) ? { readme: path.resolve(indexFile) } : {})
        }
      }
      const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jsdocdocs-'))
      try {
        const configPath = path.join(workDir, 'jsdoc.conf.json')
        fs.writeFileSync(configPath, JSON.stringify(config))
        const bin = resolveJsdocBin()
        // Pass on what jsdoc and the theme report (warnings such as a page which failed to render), which would
        // otherwise be lost with the captured output
        const { stdout = '', stderr = '' } = (await runJsdoc(bin, ['-c', configPath])) || {}
        const report = `${stdout}${stderr}`.trim()
        if (report) {
          console.warn(report)
        }
      } finally {
        await removeDirectory(workDir)
      }
    }
    return typeof done === 'function' ? generate().then(() => done(), done) : generate()
  }
}
