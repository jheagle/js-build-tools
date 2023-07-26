const fs = require('fs')
const gulpConfig = require('../gulp.config')
const setUp = require('./test-helpers/setUp')
const typeScript = require('./typeScript')
const { countMatches, logObject } = require('./testHelpers')

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

describe('typeScript', () => {
  test('copies the src directory and compiles it into the dist directory', done => {
    const distPath = gulpConfig.get('distPath')
    const srcPath = gulpConfig.get('srcPath')
    const srcFile = `${srcPath}/typeScript.ts`
    expect.assertions(3)
    const oldContents = fs.readFileSync(srcFile).toString()
    expect(countMatches(oldContents, 'sayHello(name: string)')).toEqual(1)
    typeScript(srcFile)
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
  }, 7000)
})
