import * as setUp from './test-helpers/setUp.mjs'
import { watchTest } from './watchTest.mjs'
import { EventEmitter } from 'node:events'
import fs from 'fs'
import { testQuick } from './testQuick.mjs'

setUp.setDefaults('test-watch-test')
const gulpConfig = setUp.gulpConfig
gulpConfig.set('test.watch', 'test-begin-watcher/*.js')

jest.mock('./testQuick.mjs', () => ({ testQuick: jest.fn(() => Promise.resolve(true)) }))

const rawContents = 'const gulpConfig = require(\'../gulp.config.js\')\n' +
  'const { watch } = require(\'gulp\')\n' +
  'const testQuick = require(\'./testQuick\')\n' +
  '\n' +
  '/**\n' +
  ' * Watch for changes and run the tests.\n' +
  ' * @function\n' +
  ' * @memberOf module:js-build-tools\n' +
  ' * @returns {*}\n' +
  ' */\n' +
  'const watchTest = () => watch(gulpConfig.get(\'watchSearch\'), { ignoreInitial: false }, testQuick)\n' +
  '\n' +
  'module.exports = watchTest\n'

const filePath = gulpConfig.get('srcPath') + '/watchTest.js'

beforeEach(() => setUp.beforeEach()
  .then(
    () => fs.writeFileSync(filePath, rawContents)
  )
)

afterEach(setUp.afterEach)

describe('watchTest', () => {
  test('returns instance of EventEmitter / FSWatcher and calls testQuick on change', done => {
    expect.assertions(2)
    const fsWatcher = watchTest()
    expect(fsWatcher).toBeInstanceOf(EventEmitter)
    fsWatcher.emit('change')
    setTimeout(() => {
      expect(testQuick).toHaveBeenCalled()
      done()
    }, 500)
    fsWatcher.close()
  })
})
