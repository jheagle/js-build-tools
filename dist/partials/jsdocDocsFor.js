"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveJsdocTheme = exports.resolveJsdocBin = exports.jsdocDocsFor = void 0;
require("core-js/modules/es.json.stringify.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.find.js");
require("core-js/modules/esnext.iterator.map.js");
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodeOs = _interopRequireDefault(require("node:os"));
var _nodePath = _interopRequireDefault(require("node:path"));
var _nodeModule = require("node:module");
var _nodeChild_process = require("node:child_process");
var _nodeUtil = require("node:util");
var gulpConfig = _interopRequireWildcard(require("../../gulp.config.js"));
var _removeDirectory = require("./removeDirectory.js");
var _jsdocBase = _interopRequireDefault(require("../../jsdoc.base.js"));
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// jsdoc.base.js is CommonJS (it's also required directly by consuming projects' own .jsdoc.conf.js) - Node's ESM
// loader imports a CJS module's module.exports as the default export directly, no createRequire/import.meta needed
// (import.meta.url tripped up this project's own Babel CJS transform, which Jest relies on to run .mjs test files -
// confirmed by removing it and nothing else changing).

const execFileAsync = (0, _nodeUtil.promisify)(_nodeChild_process.execFile);
const escapeHtml = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsdocInstallHint = 'Install it in your project with: npm install --save-dev jsdoc';
const themeInstallHint = name => `Install it in your project with: npm install --save-dev ${name}`;

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
const resolvePeerDir = (name, {
  task,
  installHint,
  projectPath = process.cwd()
}) => {
  const req = (0, _nodeModule.createRequire)(_nodePath.default.join(projectPath, 'package.json'));
  const found = (req.resolve.paths(name) || []).map(dir => _nodePath.default.join(dir, name)).find(dir => _nodeFs.default.existsSync(_nodePath.default.join(dir, 'package.json')));
  if (!found) {
    throw new Error(`The ${task} task needs the optional peer dependency ${name}, which is not installed. ${installHint}`);
  }
  return found;
};

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
const resolveJsdocBin = (projectPath = process.cwd()) => _nodePath.default.join(resolvePeerDir('jsdoc', {
  task: 'docs',
  installHint: jsdocInstallHint,
  projectPath
}), 'jsdoc.js');

/**
 * Resolve a jsdoc theme package's own template directory, for jsdoc's own opts.template config key: the folder
 * holding its publish.js. That is the package root for a classic jsdoc template (clean-jsdoc-theme 4.x included),
 * but `dist` for a bundled one (clean-jsdoc-theme 5.x).
 * @memberOf module:partials
 * @param {string} name
 * @param {string} [projectPath=process.cwd()]
 * @returns {string}
 */
exports.resolveJsdocBin = resolveJsdocBin;
const resolveJsdocTheme = (name, projectPath = process.cwd()) => {
  const packageDir = resolvePeerDir(name, {
    task: 'docs',
    installHint: themeInstallHint(name),
    projectPath
  });
  const distDir = _nodePath.default.join(packageDir, 'dist');
  return _nodeFs.default.existsSync(_nodePath.default.join(distDir, 'publish.js')) ? distDir : packageDir;
};

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
exports.resolveJsdocTheme = resolveJsdocTheme;
const jsdocDocsFor = (srcPath = gulpConfig.get('docs.from'), outPath = gulpConfig.get('docs.to'), runJsdoc = (bin, args) => execFileAsync(process.execPath, [bin, ...args])) => {
  if (gulpConfig.get('docs.enabled') === false) {
    return () => {};
  }
  return done => {
    const generate = async () => {
      const theme = gulpConfig.get('docs.theme') || 'clean-jsdoc-theme';
      const themeDir = resolveJsdocTheme(theme);
      const indexFile = gulpConfig.get('docs.index');
      const title = gulpConfig.get('docs.title');
      await (0, _removeDirectory.removeDirectory)(outPath);
      const config = {
        ..._jsdocBase.default,
        source: {
          ..._jsdocBase.default.source,
          include: [].concat(srcPath).map(includePath => _nodePath.default.resolve(includePath))
        },
        opts: {
          destination: _nodePath.default.resolve(outPath),
          // jsdoc does not recurse into source.include's own subdirectories by default - without this, only
          // the top level of docs.from would ever be scanned. Confirmed from clean-jsdoc-theme's own README
          // quick-start example, which sets this explicitly, not assumed from jsdoc's own classic defaults.
          recurse: true,
          template: themeDir,
          // clean-jsdoc-theme's own options for the name in its header and the home page's <title> (otherwise "Home").
          // The header is given as a link: a plain-text title links to the site root ("/"), while every page is in one
          // folder, so index.html is the home page wherever they are served. Both are printed unescaped by the theme.
          ...(title ? {
            theme_opts: {
              title: `<a href="index.html" class="sidebar-title sidebar-title-anchor">${escapeHtml(title)}</a>`,
              homepageTitle: escapeHtml(title)
            }
          } : {}),
          ...(indexFile && _nodeFs.default.existsSync(indexFile) ? {
            readme: _nodePath.default.resolve(indexFile)
          } : {})
        }
      };
      const workDir = _nodeFs.default.mkdtempSync(_nodePath.default.join(_nodeOs.default.tmpdir(), 'jsdocdocs-'));
      try {
        const configPath = _nodePath.default.join(workDir, 'jsdoc.conf.json');
        _nodeFs.default.writeFileSync(configPath, JSON.stringify(config));
        const bin = resolveJsdocBin();
        // Pass on what jsdoc and the theme report (warnings such as a page which failed to render), which would
        // otherwise be lost with the captured output
        const {
          stdout = '',
          stderr = ''
        } = (await runJsdoc(bin, ['-c', configPath])) || {};
        const report = `${stdout}${stderr}`.trim();
        if (report) {
          console.warn(report);
        }
      } finally {
        await (0, _removeDirectory.removeDirectory)(workDir);
      }
    };
    return typeof done === 'function' ? generate().then(() => done(), done) : generate();
  };
};
exports.jsdocDocsFor = jsdocDocsFor;