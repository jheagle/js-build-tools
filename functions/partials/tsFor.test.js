const fs = require('fs')
const setUp = require('../test-helpers/setUp')
setUp.setDefaults('test-ts-for')
const gulpConfig = setUp.gulpConfig
const tsFor = require('./tsFor')
const { countMatches, logObject } = require('../testHelpers')

const rawContents = 'export function sayHello(name: string) {\n' +
  '  return `Hello from ${name}`;\n' +
  '}'

beforeEach(
  () => setUp.beforeEach()
    .then(
      async () => {
        const srcPath = gulpConfig.get('srcPath')
        return fs.writeFileSync(`${srcPath}/typeScript.ts`, rawContents)
      }
    )
)

afterEach(setUp.afterEach)

describe('tsFor', () => {
  test('copies the src directory and compiles it into the dist directory', done => {
    const distPath = gulpConfig.get('distPath')
    const srcPath = gulpConfig.get('srcPath')
    const srcFile = `${srcPath}/typeScript.ts`
    expect.assertions(3)
    const oldContents = fs.readFileSync(srcFile).toString()
    expect(countMatches(oldContents, 'sayHello(name: string)')).toEqual(1)
    tsFor(srcFile, distPath)
      .on('finish', () => {
        expect(fs.existsSync(distPath)).toBeTruthy()
        const compiledContents = fs.readFileSync(`${distPath}/typeScript.js`).toString()
        expect(countMatches(compiledContents, 'sayHello(name)')).toEqual(1)
        done()
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done()
      })
  }, 30000)
})
