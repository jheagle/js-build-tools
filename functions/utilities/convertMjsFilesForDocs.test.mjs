/* eslint-disable no-template-curly-in-string -- fixture source code, the ${...} is meant to stay literal */
import fs from 'fs'
import * as setUp from '../test-helpers/setUp.mjs'
import { convertMjsFilesForDocs } from './convertMjsFilesForDocs.mjs'

setUp.setDefaults('test-temp-convert-mjs-for-docs')
const gulpConfig = setUp.gulpConfig

const rawContents = '/**\n' +
  ' * Say hello with a given name.\n' +
  ' * @memberOf module:greet\n' +
  ' * @param {string} name\n' +
  ' * @returns {string}\n' +
  ' */\n' +
  'export const sayHello = name => `Hello from ${name}`\n'

beforeEach(() => setUp.beforeEach()
  .then(() => fs.writeFileSync(gulpConfig.get('srcPath') + '/greet.mjs', rawContents)))

afterEach(setUp.afterEach)

describe('convertMjsFilesForDocs', () => {
  test('returns an empty result, with a safe no-op cleanUp, for an empty list', () => {
    const { filePaths, cleanUp } = convertMjsFilesForDocs([])
    expect(filePaths).toEqual([])
    expect(() => cleanUp()).not.toThrow()
  })

  test('writes a rewritten, doc-parseable .js copy outside the project tree', () => {
    const mjsFilePath = gulpConfig.get('srcPath') + '/greet.mjs'
    const { filePaths, cleanUp } = convertMjsFilesForDocs([mjsFilePath])

    expect(filePaths).toHaveLength(1)
    expect(filePaths[0]).toMatch(/greet\.js$/)
    expect(filePaths[0]).not.toContain(process.cwd())

    const converted = fs.readFileSync(filePaths[0], 'utf8')
    expect(converted).toContain('const sayHello = name => `Hello from ${name}`')
    expect(converted).toContain('module.exports = { sayHello }')

    cleanUp()
    expect(fs.existsSync(filePaths[0])).toBe(false)
  })

  test('converts several files into the same temp directory', () => {
    fs.writeFileSync(gulpConfig.get('srcPath') + '/greetAgain.mjs', rawContents.replace('sayHello', 'sayHelloAgain'))
    const { filePaths, cleanUp } = convertMjsFilesForDocs([
      gulpConfig.get('srcPath') + '/greet.mjs',
      gulpConfig.get('srcPath') + '/greetAgain.mjs'
    ])

    expect(filePaths).toHaveLength(2)
    filePaths.forEach(filePath => expect(fs.existsSync(filePath)).toBe(true))

    cleanUp()
    filePaths.forEach(filePath => expect(fs.existsSync(filePath)).toBe(false))
  })
})
