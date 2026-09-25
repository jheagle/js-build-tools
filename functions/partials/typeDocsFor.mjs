import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import * as gulpConfig from '../../gulp.config.mjs'
import { loadTypescript } from './tsFor.mjs'
import { removeDirectory } from './removeDirectory.mjs'

// TypeDoc ships ESM-only, and this project also compiles itself to a CommonJS build (see tsFor.mjs, which hides its
// own import of gulp-ts-compile the same way), so the import() is hidden from babel's CommonJS transform.
const importModule = new Function('specifier', 'return import(specifier)')

const installHint = 'Install it in your project with: npm install --save-dev typedoc'

/**
 * Find the TypeDoc of the project being built (an optional peer dependency, only needed when the docs task is
 * enabled) and load it, so projects which do not document TypeScript never need it installed.
 * @memberOf module:partials
 * @param {string} [projectPath=process.cwd()] The folder of the project (which has the package.json) being built.
 * @returns {Promise<Object>} The TypeDoc module.
 * @throws {Error} With install instructions when typedoc is not installed.
 */
export const loadTypeDoc = async (projectPath = process.cwd()) => {
  let typeDocPath
  try {
    typeDocPath = createRequire(path.join(projectPath, 'package.json')).resolve('typedoc')
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new Error(`The docs task needs the optional peer dependency typedoc, which is not installed. ${installHint}`)
    }
    throw error
  }
  return importModule(pathToFileURL(typeDocPath).href)
}

const isSource = fileName => /\.(ts|tsx|mts|cts)$/.test(fileName) && !/\.d\.[cm]?ts$/.test(fileName) && !/\.(test|spec)\./.test(fileName)

const listSources = dirPath => fs.readdirSync(dirPath, { withFileTypes: true }).flatMap(entry => {
  const entryPath = path.join(dirPath, entry.name)
  if (entry.isDirectory()) {
    return entry.name === 'node_modules' ? [] : listSources(entryPath)
  }
  return isSource(entry.name) ? [entryPath] : []
})

const toIdentifier = fileName => fileName.replace(/[^\w$]+(\w)?/g, (match, letter) => (letter || '').toUpperCase()).replace(/^(\d)/, '_$1')

const toModulePath = filePath => filePath.replace(/\.[cm]?tsx?$/, '').split(path.sep).join('/')

/**
 * Describe what a source file exports: whether it has a default export, and whether it has any named exports.
 * @memberOf module:partials
 * @param {Object} ts - The TypeScript compiler API.
 * @param {string} filePath
 * @returns {{hasDefault: boolean, hasNamed: boolean}}
 */
export const describeExports = (ts, filePath) => {
  const source = ts.createSourceFile(filePath, fs.readFileSync(filePath, 'utf8'), ts.ScriptTarget.Latest)
  let hasDefault = false
  let hasNamed = false
  source.statements.forEach(statement => {
    if (ts.isExportAssignment(statement)) {
      hasDefault = hasDefault || !statement.isExportEquals
      return
    }
    if (ts.isExportDeclaration(statement)) {
      const names = statement.exportClause && ts.isNamedExports(statement.exportClause) ? statement.exportClause.elements : null
      if (names && names.some(element => element.name.text === 'default')) {
        hasDefault = true
      }
      if (!names || names.some(element => element.name.text !== 'default')) {
        hasNamed = true
      }
      return
    }
    const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) || [] : []
    if (modifiers.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
      if (modifiers.some(modifier => modifier.kind === ts.SyntaxKind.DefaultKeyword)) {
        hasDefault = true
      } else {
        hasNamed = true
      }
    }
  })
  return { hasDefault, hasNamed }
}

/**
 * Write one entry file per folder of the source directory into the entry directory. TypeDoc makes a module of every
 * entry file, so the modules of the documentation mirror the folders. The default export of each source file is
 * re-exported under the name of the file (the source files hold one function each), and anything else a file exports
 * is re-exported as it is (that is where the types.ts files go). Index files (the barrels), tests and declaration
 * files are left out. A source directory with no folders gets a single entry called index.
 * @memberOf module:partials
 * @param {Object} ts - The TypeScript compiler API.
 * @param {string} srcDir - The directory holding the TypeScript source.
 * @param {string} entryDir - The directory to write the entry files into.
 * @returns {Array<string>} The paths of the entry files.
 */
export const writeDocEntries = (ts, srcDir, entryDir) => {
  const absoluteSrc = path.resolve(srcDir)
  fs.mkdirSync(entryDir, { recursive: true })
  const folders = fs.readdirSync(absoluteSrc, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && entry.name !== 'node_modules')
    .map(entry => ({ name: entry.name, files: listSources(path.join(absoluteSrc, entry.name)) }))
    .filter(folder => folder.files.length)
  const groups = folders.length
    ? folders
    : [{ name: 'index', files: listSources(absoluteSrc).filter(file => !/^(index|main)\./.test(path.basename(file))) }]
  return groups.map(group => {
    const lines = group.files
      .filter(file => !/^index\./.test(path.basename(file)))
      .sort()
      .flatMap(file => {
        const modulePath = toModulePath(file)
        const { hasDefault, hasNamed } = describeExports(ts, file)
        const fileName = path.basename(file).replace(/\.[cm]?tsx?$/, '')
        return [
          ...(hasDefault ? [`export { default as ${toIdentifier(fileName)} } from '${modulePath}'`] : []),
          ...(hasNamed ? [`export * from '${modulePath}'`] : [])
        ]
      })
    const entryPath = path.join(entryDir, `${group.name}.ts`)
    fs.writeFileSync(entryPath, lines.join('\n') + '\n')
    return entryPath
  })
}

const projectName = () => {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')).name
  } catch (error) {
    return path.basename(process.cwd())
  }
}

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
export const typeDocsFor = (
  srcPath = gulpConfig.get('docs.from'),
  outPath = gulpConfig.get('docs.to'),
  loadDocs = loadTypeDoc
) => {
  if (gulpConfig.get('docs.enabled') === false) {
    return () => {}
  }
  return (done) => {
    const generate = async () => {
      const ts = loadTypescript()
      const { Application } = await loadDocs()
      const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'typedocs-'))
      try {
        const entryPoints = writeDocEntries(ts, srcPath, path.join(workDir, 'entries'))
        // The entry files live outside the project, so the tsconfig which is used for the documentation extends the
        // one of the project and adds the entries to the files it includes.
        const projectConfig = gulpConfig.get('docs.tsconfig') || gulpConfig.get('typescript.config')
        const tsconfig = path.join(workDir, 'tsconfig.json')
        fs.writeFileSync(tsconfig, JSON.stringify({
          ...(projectConfig ? { extends: path.resolve(projectConfig) } : {}),
          include: [path.join(workDir, 'entries', '*.ts').split(path.sep).join('/'), path.resolve(srcPath).split(path.sep).join('/') + '/**/*.ts'],
          exclude: [path.resolve(srcPath).split(path.sep).join('/') + '/**/*.test.*']
        }))
        const indexFile = gulpConfig.get('docs.index')
        await removeDirectory(outPath)
        const app = await Application.bootstrap({
          entryPoints,
          tsconfig,
          name: gulpConfig.get('docs.title') || projectName(),
          readme: indexFile && fs.existsSync(indexFile) ? indexFile : 'none',
          logLevel: gulpConfig.get('docs.logLevel') || 'Warn',
          skipErrorChecking: true
        })
        const project = await app.convert()
        if (!project) {
          throw new Error('TypeDoc could not read the TypeScript source, see the errors above.')
        }
        await app.generateDocs(project, outPath)
      } finally {
        await removeDirectory(workDir)
      }
    }
    return typeof done === 'function' ? generate().then(() => done(), done) : generate()
  }
}
