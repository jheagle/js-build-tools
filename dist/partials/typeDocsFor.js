"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeDocEntries = exports.typeDocsFor = exports.loadTypeDoc = exports.describeFolder = exports.describeFile = exports.describeExports = void 0;
require("core-js/modules/es.json.stringify.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.filter.js");
require("core-js/modules/esnext.iterator.find.js");
require("core-js/modules/esnext.iterator.flat-map.js");
require("core-js/modules/esnext.iterator.for-each.js");
require("core-js/modules/esnext.iterator.map.js");
require("core-js/modules/esnext.iterator.some.js");
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodeOs = _interopRequireDefault(require("node:os"));
var _nodePath = _interopRequireDefault(require("node:path"));
var gulpConfig = _interopRequireWildcard(require("../../gulp.config.js"));
var _loadPeer = require("./loadPeer.js");
var _tsFor = require("./tsFor.js");
var _removeDirectory = require("./removeDirectory.js");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const installHint = 'Install it in your project with: npm install --save-dev typedoc';

/**
 * Find the TypeDoc of the project being built (an optional peer dependency, only needed when the docs task is
 * enabled) and load it, so projects which do not document TypeScript never need it installed.
 * @memberOf module:partials
 * @param {string} [projectPath=process.cwd()] The folder of the project (which has the package.json) being built.
 * @returns {Promise<Object>} The TypeDoc module.
 * @throws {Error} With install instructions when typedoc is not installed.
 */
const loadTypeDoc = (projectPath = process.cwd()) => (0, _loadPeer.importPeer)('typedoc', {
  task: 'docs',
  installHint,
  projectPath
});
exports.loadTypeDoc = loadTypeDoc;
const isSource = fileName => /\.(ts|tsx|mts|cts)$/.test(fileName) && !/\.d\.[cm]?ts$/.test(fileName) && !/\.(test|spec)\./.test(fileName);
const listSources = dirPath => _nodeFs.default.readdirSync(dirPath, {
  withFileTypes: true
}).flatMap(entry => {
  const entryPath = _nodePath.default.join(dirPath, entry.name);
  if (entry.isDirectory()) {
    return entry.name === 'node_modules' ? [] : listSources(entryPath);
  }
  return isSource(entry.name) ? [entryPath] : [];
});
const toIdentifier = fileName => fileName.replace(/[^\w$]+(\w)?/g, (match, letter) => (letter || '').toUpperCase()).replace(/^(\d)/, '_$1');
const toModulePath = filePath => filePath.replace(/\.[cm]?tsx?$/, '').split(_nodePath.default.sep).join('/');

/**
 * Describe what a source file exports: whether it has a default export, and whether it has any named exports.
 * @memberOf module:partials
 * @param {Object} ts - The TypeScript compiler API.
 * @param {string} filePath
 * @returns {{hasDefault: boolean, hasNamed: boolean}}
 */
const describeExports = (ts, filePath) => {
  const source = ts.createSourceFile(filePath, _nodeFs.default.readFileSync(filePath, 'utf8'), ts.ScriptTarget.Latest);
  let hasDefault = false;
  let hasNamed = false;
  source.statements.forEach(statement => {
    if (ts.isExportAssignment(statement)) {
      hasDefault = hasDefault || !statement.isExportEquals;
      return;
    }
    if (ts.isExportDeclaration(statement)) {
      const names = statement.exportClause && ts.isNamedExports(statement.exportClause) ? statement.exportClause.elements : null;
      if (names && names.some(element => element.name.text === 'default')) {
        hasDefault = true;
      }
      if (!names || names.some(element => element.name.text !== 'default')) {
        hasNamed = true;
      }
      return;
    }
    const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) || [] : [];
    if (modifiers.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
      if (modifiers.some(modifier => modifier.kind === ts.SyntaxKind.DefaultKeyword)) {
        hasDefault = true;
      } else {
        hasNamed = true;
      }
    }
  });
  return {
    hasDefault,
    hasNamed
  };
};

/**
 * The description of a folder for its module: the first doc comment of the folder's index file, without its tags
 * (@module, @file, ...), or an empty string when there is none.
 * @memberOf module:partials
 * @param {string} folderPath
 * @returns {string}
 */
exports.describeExports = describeExports;
const describeFolder = folderPath => {
  const indexFile = ['index.ts', 'index.tsx', 'index.mts', 'index.cts'].map(name => _nodePath.default.join(folderPath, name)).find(file => _nodeFs.default.existsSync(file));
  return indexFile ? describeFile(indexFile) : '';
};

/**
 * The description of a source file for its module: its first doc comment without the tags (@module, @file, ...), when
 * that comment is a header (it is followed by an import or export, so it does not document a declaration itself), or
 * an empty string.
 * @memberOf module:partials
 * @param {string} filePath
 * @returns {string}
 */
exports.describeFolder = describeFolder;
const describeFile = filePath => {
  const comment = _nodeFs.default.readFileSync(filePath, 'utf8').match(/^\s*\/\*\*([\s\S]*?)\*\/\s*(import\b|export\s+(\*|\{[^}]*\}\s+from)|$)/);
  if (!comment) {
    return '';
  }
  const lines = comment[1].split('\n').map(line => line.replace(/^\s*\* ?/, '').trimEnd());
  const tagAt = lines.findIndex(line => /^@\w+/.test(line));
  return (tagAt === -1 ? lines : lines.slice(0, tagAt)).join('\n').trim();
};

/**
 * Write one entry file per folder of the source directory into the entry directory. TypeDoc makes a module of every
 * entry file, so the modules of the documentation mirror the folders. The default export of each source file is
 * re-exported under the name of the file (the source files hold one function each), and anything else a file exports
 * is re-exported as it is (that is where the types.ts files go). Index files (the barrels), tests and declaration
 * files are left out, but the first doc comment of a folder's index file becomes the description of its module.
 * A file which sits beside the folders (not an index or main file) is a module of its own, described by its header
 * comment. A source directory with no folders gets a single entry called index.
 * @memberOf module:partials
 * @param {Object} ts - The TypeScript compiler API.
 * @param {string} srcDir - The directory holding the TypeScript source.
 * @param {string} entryDir - The directory to write the entry files into.
 * @returns {Array<string>} The paths of the entry files.
 */
exports.describeFile = describeFile;
const writeDocEntries = (ts, srcDir, entryDir) => {
  const absoluteSrc = _nodePath.default.resolve(srcDir);
  _nodeFs.default.mkdirSync(entryDir, {
    recursive: true
  });
  const folders = _nodeFs.default.readdirSync(absoluteSrc, {
    withFileTypes: true
  }).filter(entry => entry.isDirectory() && entry.name !== 'node_modules').map(entry => ({
    name: entry.name,
    path: _nodePath.default.join(absoluteSrc, entry.name),
    files: listSources(_nodePath.default.join(absoluteSrc, entry.name))
  })).filter(folder => folder.files.length);
  const rootFiles = _nodeFs.default.readdirSync(absoluteSrc, {
    withFileTypes: true
  }).filter(entry => entry.isFile() && isSource(entry.name) && !/^(index|main)\./.test(entry.name)).map(entry => _nodePath.default.join(absoluteSrc, entry.name));
  // Folders make modules, and so do the files which sit beside them (except the barrel: index and main). A source
  // directory with no folders gets a single module called index which holds its files.
  const groups = folders.length ? [...folders, ...rootFiles.map(file => ({
    name: toIdentifier(_nodePath.default.basename(file).replace(/\.[cm]?tsx?$/, '')),
    files: [file],
    description: describeFile(file)
  })).filter(group => !folders.some(folder => folder.name === group.name))] : [{
    name: 'index',
    path: absoluteSrc,
    files: rootFiles
  }];
  return groups.map(group => {
    const lines = group.files.filter(file => !/^index\./.test(_nodePath.default.basename(file))).sort().flatMap(file => {
      const modulePath = toModulePath(file);
      const {
        hasDefault,
        hasNamed
      } = describeExports(ts, file);
      const fileName = _nodePath.default.basename(file).replace(/\.[cm]?tsx?$/, '');
      return [...(hasDefault ? [`export { default as ${toIdentifier(fileName)} } from '${modulePath}'`] : []), ...(hasNamed ? [`export * from '${modulePath}'`] : [])];
    });
    const description = group.description ?? (group.path ? describeFolder(group.path) : '');
    // TypeDoc takes the first comment of an entry file which has the @module tag as the description of the module
    const moduleComment = description ? `/**\n${description.split('\n').map(line => ` * ${line}`.trimEnd()).join('\n')}\n * @module\n */\n\n` : '';
    const entryPath = _nodePath.default.join(entryDir, `${group.name}.ts`);
    _nodeFs.default.writeFileSync(entryPath, moduleComment + lines.join('\n') + '\n');
    return entryPath;
  });
};
exports.writeDocEntries = writeDocEntries;
const projectName = () => {
  try {
    return JSON.parse(_nodeFs.default.readFileSync(_nodePath.default.join(process.cwd(), 'package.json'), 'utf8')).name;
  } catch (error) {
    return _nodePath.default.basename(process.cwd());
  }
};

/**
 * Generate the HTML documentation of a TypeScript project with TypeDoc, straight from the TypeScript source, so the
 * types (and the comments on them) are documented from where they are defined. The modules mirror the folders of the
 * source, see {@link writeDocEntries}. Configure this with 'docs.from', 'docs.to', 'docs.index', 'docs.title',
 * 'docs.tsconfig' and 'docs.logLevel'.
 * @memberOf module:partials
 * @param {string} [srcPath=gulpConfig.get('docs.from')] - The directory holding the TypeScript source.
 * @param {string} [outPath=gulpConfig.get('docs.to')] - The directory the documentation is generated into (cleared first).
 * @param {function(string): Promise<Object>} [loadDocs] - Resolves the TypeDoc module, tests can inject a stand-in.
 * @returns {Function} A gulp task, it accepts an optional callback and returns a promise.
 */
const typeDocsFor = (srcPath = gulpConfig.get('docs.from'), outPath = gulpConfig.get('docs.to'), loadDocs = loadTypeDoc) => {
  if (gulpConfig.get('docs.enabled') === false) {
    return () => {};
  }
  return done => {
    const generate = async () => {
      const ts = (0, _tsFor.loadTypescript)();
      const {
        Application
      } = await loadDocs();
      const workDir = _nodeFs.default.mkdtempSync(_nodePath.default.join(_nodeOs.default.tmpdir(), 'typedocs-'));
      try {
        const entryPoints = writeDocEntries(ts, srcPath, _nodePath.default.join(workDir, 'entries'));
        // The entry files live outside the project, so the tsconfig which is used for the documentation extends the
        // one of the project and adds the entries to the files it includes.
        const projectConfig = gulpConfig.get('docs.tsconfig') || gulpConfig.get('typescript.config');
        const tsconfig = _nodePath.default.join(workDir, 'tsconfig.json');
        _nodeFs.default.writeFileSync(tsconfig, JSON.stringify({
          ...(projectConfig ? {
            extends: _nodePath.default.resolve(projectConfig)
          } : {}),
          include: [_nodePath.default.join(workDir, 'entries', '*.ts').split(_nodePath.default.sep).join('/'), _nodePath.default.resolve(srcPath).split(_nodePath.default.sep).join('/') + '/**/*.ts'],
          exclude: [_nodePath.default.resolve(srcPath).split(_nodePath.default.sep).join('/') + '/**/*.test.*']
        }));
        const indexFile = gulpConfig.get('docs.index');
        await (0, _removeDirectory.removeDirectory)(outPath);
        const app = await Application.bootstrap({
          entryPoints,
          tsconfig,
          name: gulpConfig.get('docs.title') || projectName(),
          readme: indexFile && _nodeFs.default.existsSync(indexFile) ? indexFile : 'none',
          logLevel: gulpConfig.get('docs.logLevel') || 'Warn',
          skipErrorChecking: true
        });
        const project = await app.convert();
        if (!project) {
          throw new Error('TypeDoc could not read the TypeScript source, see the errors above.');
        }
        await app.generateDocs(project, outPath);
      } finally {
        await (0, _removeDirectory.removeDirectory)(workDir);
      }
    };
    return typeof done === 'function' ? generate().then(() => done(), done) : generate();
  };
};
exports.typeDocsFor = typeDocsFor;