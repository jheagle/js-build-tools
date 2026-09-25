import fs from 'fs'
import path from 'node:path'
import ts from 'typescript'
import * as setUp from '../test-helpers/setUp.mjs'
import { describeExports, loadTypeDoc, typeDocsFor, writeDocEntries } from './typeDocsFor.mjs'

setUp.setDefaults('test-type-docs-for')
const gulpConfig = setUp.gulpConfig

const write = (file, contents) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, contents)
}

beforeEach(
  () => setUp.beforeEach().then(() => {
    const srcPath = gulpConfig.get('srcPath')
    write(`${srcPath}/main.ts`, "import a from './point/add'\nexport default { a }\n")
    write(`${srcPath}/point/add.ts`, '/** Add two numbers. */\nconst add = (a: number, b: number): number => a + b\n\nexport default add\n')
    write(`${srcPath}/point/get-name.ts`, 'export default function getName (): string { return "name" }\n')
    write(`${srcPath}/point/types.ts`, 'export interface Point { x: number, y: number }\nexport type Axis = keyof Point\n')
    write(`${srcPath}/point/index.ts`, "import add from './add'\nexport default { add }\n")
    write(`${srcPath}/point/add.test.ts`, "test('adds', () => {})\n")
    write(`${srcPath}/point/add.d.ts`, 'export {}\n')
    write(`${srcPath}/line/length.ts`, 'export const length = 5\nexport default length\n')
    write(`${srcPath}/empty/README.md`, 'nothing to document\n')
  })
)

afterEach(setUp.afterEach)

describe('describeExports', () => {
  const inSrc = name => `${gulpConfig.get('srcPath')}/${name}`

  test('finds a default export', () => {
    expect(describeExports(ts, inSrc('point/add.ts'))).toEqual({ hasDefault: true, hasNamed: false })
  })

  test('finds a default function declaration', () => {
    expect(describeExports(ts, inSrc('point/get-name.ts'))).toEqual({ hasDefault: true, hasNamed: false })
  })

  test('finds named exports (types)', () => {
    expect(describeExports(ts, inSrc('point/types.ts'))).toEqual({ hasDefault: false, hasNamed: true })
  })

  test('finds both when a file has both', () => {
    expect(describeExports(ts, inSrc('line/length.ts'))).toEqual({ hasDefault: true, hasNamed: true })
  })

  test('understands export lists and re-exports', () => {
    write(inSrc('lists.ts'), "const a = 1\nconst b = 2\nexport { a as default, b }\nexport * from './point/types'\n")
    expect(describeExports(ts, inSrc('lists.ts'))).toEqual({ hasDefault: true, hasNamed: true })
  })
})

describe('writeDocEntries', () => {
  test('writes one entry file for each folder which has source', () => {
    const entryDir = `${gulpConfig.get('srcPath')}/../entries`
    const entries = writeDocEntries(ts, gulpConfig.get('srcPath'), entryDir)
    expect(entries.map(entry => path.basename(entry)).sort()).toEqual(['line.ts', 'point.ts'])
  })

  test('re-exports the default of each file by its name and the named exports as they are', () => {
    const entryDir = `${gulpConfig.get('srcPath')}/../entries`
    writeDocEntries(ts, gulpConfig.get('srcPath'), entryDir)
    const absoluteSrc = path.resolve(gulpConfig.get('srcPath')).split(path.sep).join('/')
    expect(fs.readFileSync(`${entryDir}/point.ts`, 'utf8').trim().split('\n')).toEqual([
      `export { default as add } from '${absoluteSrc}/point/add'`,
      `export { default as getName } from '${absoluteSrc}/point/get-name'`,
      `export * from '${absoluteSrc}/point/types'`
    ])
    expect(fs.readFileSync(`${entryDir}/line.ts`, 'utf8').trim().split('\n')).toEqual([
      `export { default as length } from '${absoluteSrc}/line/length'`,
      `export * from '${absoluteSrc}/line/length'`
    ])
  })

  test('leaves out index files, tests and declaration files', () => {
    const entryDir = `${gulpConfig.get('srcPath')}/../entries`
    writeDocEntries(ts, gulpConfig.get('srcPath'), entryDir)
    const entry = fs.readFileSync(`${entryDir}/point.ts`, 'utf8')
    expect(entry).not.toMatch(/index|\.test|add\.d/)
  })

  test('makes one entry called index when the source has no folders', () => {
    const flat = `${gulpConfig.get('srcPath')}/../flat`
    write(`${flat}/one.ts`, 'export default 1\n')
    write(`${flat}/main.ts`, 'export default 2\n')
    const entries = writeDocEntries(ts, flat, `${flat}/../flat-entries`)
    expect(entries.map(entry => path.basename(entry))).toEqual(['index.ts'])
    expect(fs.readFileSync(entries[0], 'utf8')).toMatch(/default as one/)
    expect(fs.readFileSync(entries[0], 'utf8')).not.toMatch(/main/)
  })
})

describe('typeDocsFor', () => {
  const fakeTypeDoc = calls => () => Promise.resolve({
    Application: {
      bootstrap: async options => {
        calls.options = options
        calls.entryContents = options.entryPoints.map(entry => fs.readFileSync(entry, 'utf8'))
        calls.tsconfig = JSON.parse(fs.readFileSync(options.tsconfig, 'utf8'))
        return {
          convert: async () => ({ name: 'project' }),
          generateDocs: async (project, out) => {
            calls.generated = { project, out }
            fs.mkdirSync(out, { recursive: true })
            fs.writeFileSync(`${out}/index.html`, '<html></html>')
          }
        }
      }
    }
  })

  test('generates the documentation into the output directory, clearing what was there', done => {
    gulpConfig.set('docs.enabled', true)
    const outPath = `${gulpConfig.get('srcPath')}/../docs`
    write(`${outPath}/stale.html`, 'old')
    const calls = {}
    typeDocsFor(gulpConfig.get('srcPath'), outPath, fakeTypeDoc(calls))(() => {
      expect(fs.existsSync(`${outPath}/stale.html`)).toBe(false)
      expect(fs.existsSync(`${outPath}/index.html`)).toBe(true)
      expect(calls.generated.out).toBe(outPath)
      expect(calls.options.entryPoints.map(entry => path.basename(entry)).sort()).toEqual(['line.ts', 'point.ts'])
      expect(calls.options.skipErrorChecking).toBe(true)
      done()
    })
  })

  test('uses the front page and the title from the config, and none when the front page is missing', async () => {
    gulpConfig.set('docs.enabled', true)
    gulpConfig.set('docs.title', 'my-title')
    gulpConfig.set('docs.index', `${gulpConfig.get('srcPath')}/../MAIN.md`)
    write(`${gulpConfig.get('srcPath')}/../MAIN.md`, '# hello\n')
    const calls = {}
    await typeDocsFor(gulpConfig.get('srcPath'), `${gulpConfig.get('srcPath')}/../docs`, fakeTypeDoc(calls))()
    expect(calls.options.name).toBe('my-title')
    expect(calls.options.readme).toBe(`${gulpConfig.get('srcPath')}/../MAIN.md`)
    gulpConfig.set('docs.index', 'does-not-exist.md')
    await typeDocsFor(gulpConfig.get('srcPath'), `${gulpConfig.get('srcPath')}/../docs`, fakeTypeDoc(calls))()
    expect(calls.options.readme).toBe('none')
  })

  test('reads the source with the tsconfig of the project, adding the entries to it', async () => {
    gulpConfig.set('docs.enabled', true)
    gulpConfig.set('typescript.config', 'tsconfig.json')
    const calls = {}
    await typeDocsFor(gulpConfig.get('srcPath'), `${gulpConfig.get('srcPath')}/../docs`, fakeTypeDoc(calls))()
    expect(calls.tsconfig.extends).toBe(path.resolve('tsconfig.json'))
    expect(calls.tsconfig.include).toHaveLength(2)
    expect(calls.tsconfig.exclude[0]).toMatch(/\*\*\/\*\.test\.\*$/)
    gulpConfig.set('docs.tsconfig', 'other.json')
    await typeDocsFor(gulpConfig.get('srcPath'), `${gulpConfig.get('srcPath')}/../docs`, fakeTypeDoc(calls))()
    expect(calls.tsconfig.extends).toBe(path.resolve('other.json'))
    gulpConfig.set('docs.tsconfig', false)
    gulpConfig.set('typescript.config', false)
  })

  test('fails with a clear error when TypeDoc could not read the source', async () => {
    gulpConfig.set('docs.enabled', true)
    const failing = () => Promise.resolve({
      Application: { bootstrap: async () => ({ convert: async () => undefined }) }
    })
    await expect(typeDocsFor(gulpConfig.get('srcPath'), `${gulpConfig.get('srcPath')}/../docs`, failing)()).rejects.toThrow(/could not read the TypeScript source/)
  })

  test('skips if docs.enabled is false', () => {
    gulpConfig.set('docs.enabled', false)
    const result = typeDocsFor()
    expect(result).toBeInstanceOf(Function)
    expect(result()).toBeUndefined()
  })
})

describe('loadTypeDoc', () => {
  // The real import() of the ESM-only TypeDoc cannot run in this project's CommonJS-transform-based Jest setup (see
  // tsFor.mjs), so loading it for real is checked by generating the documentation of a project, see the pull request.

  test('explains how to install typedoc when the project does not have it', async () => {
    await expect(loadTypeDoc('/')).rejects.toThrow(/optional peer dependency typedoc.*npm install --save-dev typedoc/)
  })
})
