const fs = require('fs')
const setUp = require('./test-helpers/setUp')
setUp.setDefaults('test-build')
const gulpConfig = setUp.gulpConfig
const build = require('./build')
const clean = require('./partials/clean')
const testFull = require('./testFull')
const { countMatches } = require('./testHelpers')

const genericFunction = () => Promise.resolve(true)

jest.mock('./partials/clean', () => jest.fn(genericFunction))
jest.mock('./testFull', () => jest.fn(genericFunction))

const file1Contents = '/**\n' +
  ' * Console log out a greeting with given input.\n' +
  ' * @param {string} input\n' +
  ' */\n' +
  'const file1 = input => console.log(`Hello from file1 with ${input}`)\n' +
  '\n' +
  'module.exports = file1\n'

const file2Contents = '/**\n' +
  ' * Farewell with a summation of two numbers returned.\n' +
  ' * @param {number} a\n' +
  ' * @param {number} b\n' +
  ' * @returns {number}\n' +
  ' */\n' +
  'const file2 = (a, b) => {\n' +
  '  const sum = a + b\n' +
  '  console.log(`Good-bye from file2 with sum ${sum}`)\n' +
  '  return sum\n' +
  '}\n' +
  '\n' +
  'module.exports = file2\n'

const mainTypescript = '/**\n' +
  ' * A salutation and summation.\n' +
  ' * @param {number} a\n' +
  ' * @param {number} b\n' +
  ' * @returns {number}\n' +
  ' */\n' +
  'const main = (a: number, b: number): number => {\n' +
  '  const sum = a + b\n' +
  '  console.log(`Greetings from typescript ${sum}`)\n' +
  '  return sum\n' +
  '}\n' +
  '\n' +
  'module.exports = main\n'

const mainFileContents = '/**\n' +
  ' * Some test functions for usage with build tests.\n' +
  ' * @file\n' +
  ' * @author John Doe <john.doe@example.com>\n' +
  ' * @version 1.0.0\n' +
  ' * @module test-build\n' +
  ' */\n' +
  '\n' +
  'const file1 = require(\'./sources/file1\')\n' +
  'const file2 = require(\'./sources/file2\')\n' +
  '\n' +
  'module.exports = {\n' +
  '  file1,\n' +
  '  file2,\n' +
  '}\n'

const mainMd = '# Welcome\n' +
  'This is the top of the README.md.\n' +
  '\n'

const tsConfigContents = '{\n' +
  '  "files": ["test-build/src/**/*.ts"],\n' +
  '  "compilerOptions": {\n' +
  '    "noImplicitAny": true,\n' +
  '    "target": "es6",\n' +
  '    "moduleResolution": "node",\n' +
  '    "declaration": true,\n' +
  '  }\n' +
  '}'

beforeEach(
  () => setUp.beforeEach()
    .then(
      async () => {
        const srcPath = gulpConfig.get('srcPath')
        const readmePath = gulpConfig.get('readmePath')
        const sourcesPath = `${srcPath}/sources`
        await fs.mkdirSync(sourcesPath)
        return fs.writeFileSync(`${readmePath}/MAIN.md`, mainMd)
      }
    )
)

afterEach(setUp.afterEach)

describe('build', () => {
  test('when nodeOnly true: calls clean, distSeries, distLint, distMinify, compileReadme, testFull', done => {
    const srcPath = gulpConfig.get('srcPath')
    const sourcesPath = `${srcPath}/sources`
    const distPath = gulpConfig.get('distPath')
    const distSourcesPath = `${distPath}/sources`
    const readmePath = gulpConfig.get('readmePath')
    const readmeFile = gulpConfig.get('readmeFile')
    fs.writeFileSync(`${sourcesPath}/file1.js`, file1Contents)
    fs.writeFileSync(`${sourcesPath}/file2.js`, file2Contents)
    fs.writeFileSync(`${srcPath}/main.js`, mainFileContents)
    gulpConfig.set('nodeOnly', true)
    expect.assertions(20)
    build(() => {
      // Called 'clean'
      expect(clean).toHaveBeenCalled()

      // Created dist directory (distSeries)
      expect(fs.existsSync(distPath)).toBeTruthy()

      // Minify the dist files (distMinify)
      expect(fs.existsSync(`${distPath}/main.min.js`)).toBeTruthy()
      const babelifiedMain = fs.readFileSync(`${distPath}/main.js`).toString()
      // Used single quotes because of distLint
      expect(countMatches(babelifiedMain, '\'use strict\'')).toEqual(1)

      expect(fs.existsSync(`${distSourcesPath}/file1.min.js`)).toBeTruthy()
      const babelifiedFile1 = fs.readFileSync(`${distSourcesPath}/file1.js`).toString()
      expect(countMatches(babelifiedFile1, '\'use strict\'')).toEqual(1)
      expect(countMatches(babelifiedFile1, 'const ')).toEqual(0)
      expect(countMatches(babelifiedFile1, 'var ')).toEqual(1)
      expect(countMatches(babelifiedFile1, 'function ')).toEqual(1)
      expect(countMatches(babelifiedFile1, 'return ')).toEqual(1)

      expect(fs.existsSync(`${distSourcesPath}/file2.min.js`)).toBeTruthy()
      const babelifiedFile2 = fs.readFileSync(`${distSourcesPath}/file2.js`).toString()
      expect(countMatches(babelifiedFile2, '\'use strict\'')).toEqual(1)
      expect(countMatches(babelifiedFile2, 'const ')).toEqual(0)
      expect(countMatches(babelifiedFile2, 'var ')).toEqual(2)
      expect(countMatches(babelifiedFile2, 'function ')).toEqual(1)

      // Generated README.md (compileReadme)
      const readmeContents = fs.readFileSync(`${readmePath}/${readmeFile}`).toString()
      expect(countMatches(readmeContents, mainMd)).toEqual(1)
      expect(countMatches(readmeContents, 'test-build')).toEqual(4)
      expect(countMatches(readmeContents, 'file1')).toEqual(4)
      expect(countMatches(readmeContents, 'file2')).toEqual(4)

      // Ran 'testFull'
      expect(testFull).toHaveBeenCalled()
      done()
    })
  }, 30000)

  test('when nodeOnly false: calls clean, distSeries, distLint, distMinify, bundle, bundleLint, bundleMinify, compileReadme, testFull', done => {
    const srcPath = gulpConfig.get('srcPath')
    const sourcesPath = `${srcPath}/sources`
    const distPath = gulpConfig.get('distPath')
    const browserFile = gulpConfig.get('browserName')
    const browserPath = gulpConfig.get('browserPath')
    const bundledFile = `${browserPath}/${browserFile}.js`
    const readmePath = gulpConfig.get('readmePath')
    const readmeFile = gulpConfig.get('readmeFile')
    fs.writeFileSync(`${sourcesPath}/file1.js`, file1Contents)
    fs.writeFileSync(`${sourcesPath}/file2.js`, file2Contents)
    fs.writeFileSync(`${srcPath}/main.js`, mainFileContents)
    gulpConfig.set('nodeOnly', false)
    expect.assertions(13)
    build(() => {
      // Called 'clean'
      expect(clean).toHaveBeenCalled()

      // Created dist directory (distSeries)
      expect(fs.existsSync(distPath)).toBeTruthy()

      // Minify the dist files (distMinify)
      expect(fs.existsSync(`${distPath}/main.min.js`)).toBeTruthy()
      const babelifiedMain = fs.readFileSync(`${distPath}/main.js`).toString()
      // Used single quotes because of distLint
      expect(countMatches(babelifiedMain, '\'use strict\'')).toEqual(1)

      // Created browser directory (bundle)
      expect(fs.existsSync(browserPath)).toBeTruthy()

      // Minify the browser files (bundleMinify)
      expect(fs.existsSync(`${browserPath}/${browserFile}.min.js`)).toBeTruthy()
      const bundledContents = fs.readFileSync(bundledFile).toString()
      expect(countMatches(bundledContents, 'file1')).toEqual(8)
      expect(countMatches(bundledContents, 'file2')).toEqual(8)

      // Generated README.md (compileReadme)
      const readmeContents = fs.readFileSync(`${readmePath}/${readmeFile}`).toString()
      expect(countMatches(readmeContents, mainMd)).toEqual(1)
      expect(countMatches(readmeContents, 'test-build')).toEqual(4)
      expect(countMatches(readmeContents, 'file1')).toEqual(4)
      expect(countMatches(readmeContents, 'file2')).toEqual(4)

      // Ran 'testFull'
      expect(testFull).toHaveBeenCalled()
      done()
    })
  }, 30000)

  test('when nodeOnly true and useTsConfig set: calls clean, tsFor, distFor, distLint, distMinify, compileReadme, testFull', done => {
    const srcPath = gulpConfig.get('srcPath')
    const rootPath = gulpConfig.get('rootPath')
    const tsConfig = `${rootPath}/tsconfig.json`
    const distPath = gulpConfig.get('distPath')
    const readmePath = gulpConfig.get('readmePath')
    const readmeFile = gulpConfig.get('readmeFile')
    fs.writeFileSync(`${srcPath}/main.ts`, mainTypescript)
    fs.writeFileSync(tsConfig, tsConfigContents)
    gulpConfig.set('nodeOnly', true)
    gulpConfig.set('useTsConfig', tsConfig)
    gulpConfig.set('readmeSearch', `${distPath}/**/*.js`)
    expect.assertions(8)
    build(() => {
      // Called 'clean'
      expect(clean).toHaveBeenCalled()

      // Created dist directory (distSeries)
      expect(fs.existsSync(distPath)).toBeTruthy()
      // Created declaration file
      expect(fs.existsSync(`${distPath}/main.d.ts`)).toBeTruthy()

      // Minify the dist files (distMinify)
      expect(fs.existsSync(`${distPath}/main.min.js`)).toBeTruthy()
      const babelifiedMain = fs.readFileSync(`${distPath}/main.js`).toString()
      // Used single quotes because of distLint
      expect(countMatches(babelifiedMain, '\'use strict\'')).toEqual(1)

      // Generated README.md (compileReadme)
      const readmeContents = fs.readFileSync(`${readmePath}/${readmeFile}`).toString()
      expect(countMatches(readmeContents, mainMd)).toEqual(1)
      expect(countMatches(readmeContents, 'main')).toEqual(2)

      // Ran 'testFull'
      expect(testFull).toHaveBeenCalled()
      done()
    })
  }, 30000)

  test('when nodeOnly false and useTsConfig set: calls clean, tsFor, distFor, distLint, distMinify, bundle, bundleLint, bundleMinify, compileReadme, testFull', done => {
    const srcPath = gulpConfig.get('srcPath')
    const rootPath = gulpConfig.get('rootPath')
    const tsConfig = `${rootPath}/tsconfig.json`
    const distPath = gulpConfig.get('distPath')
    const browserFile = gulpConfig.get('browserName')
    const browserPath = gulpConfig.get('browserPath')
    const bundledFile = `${browserPath}/${browserFile}.js`
    const readmePath = gulpConfig.get('readmePath')
    const readmeFile = gulpConfig.get('readmeFile')
    fs.writeFileSync(`${srcPath}/main.ts`, mainTypescript)
    fs.writeFileSync(tsConfig, tsConfigContents)
    gulpConfig.set('nodeOnly', false)
    gulpConfig.set('useTsConfig', tsConfig)
    gulpConfig.set('readmeSearch', `${distPath}/**/*.js`)
    expect.assertions(11)
    build(() => {
      // Called 'clean'
      expect(clean).toHaveBeenCalled()

      // Created dist directory (distSeries)
      expect(fs.existsSync(distPath)).toBeTruthy()
      // Created declaration file
      expect(fs.existsSync(`${distPath}/main.d.ts`)).toBeTruthy()

      // Minify the dist files (distMinify)
      expect(fs.existsSync(`${distPath}/main.min.js`)).toBeTruthy()
      const babelifiedMain = fs.readFileSync(`${distPath}/main.js`).toString()
      // Used single quotes because of distLint
      expect(countMatches(babelifiedMain, '\'use strict\'')).toEqual(1)

      // Created browser directory (bundle)
      expect(fs.existsSync(browserPath)).toBeTruthy()

      // Minify the browser files (bundleMinify)
      expect(fs.existsSync(`${browserPath}/${browserFile}.min.js`)).toBeTruthy()
      const bundledContents = fs.readFileSync(bundledFile).toString()
      expect(countMatches(bundledContents, 'main')).toEqual(3)

      // Generated README.md (compileReadme)
      const readmeContents = fs.readFileSync(`${readmePath}/${readmeFile}`).toString()
      expect(countMatches(readmeContents, mainMd)).toEqual(1)
      expect(countMatches(readmeContents, 'main')).toEqual(2)

      // Ran 'testFull'
      expect(testFull).toHaveBeenCalled()
      done()
    })
  }, 30000)
})
