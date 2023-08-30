const fs = require('fs')
const setUp = require('./test-helpers/setUp')
setUp.setDefaults('test-watch-full')
const gulpConfig = setUp.gulpConfig
const watchFull = require('./watchFull')
const beginWatcher = require('./partials/beginWatcher')
const runOnChange = require('./partials/runOnChange')

jest.mock('./partials/beginWatcher', () => jest.fn(() => ({ on: (event, fn) => fn() })))
jest.mock('./partials/runOnChange', () => jest.fn())

const rawContents = 'const { beginWatcher, runOnChange } = require(\'./partials\')\n' +
  '\n' +
  '/**\n' +
  ' * Watch for changes and run the distribution for the changed files, then bundle and test the changed files.\n' +
  ' * @function\n' +
  ' * @memberOf module:js-build-tools\n' +
  ' * @returns {FSWatcher}\n' +
  ' */\n' +
  'const watchFull = () => beginWatcher()\n' +
  '  .on(\'change\', runOnChange)\n' +
  '\n' +
  'module.exports = watchFull\n'

beforeEach(setUp.beforeEach)

afterEach(setUp.afterEach)

describe('watchFull', () => {
  test('should call beginWatcher and runOnChange for change event', () => {
    const srcPath = gulpConfig.get('srcPath')
    gulpConfig.set('watchSearch', `${srcPath}/*.js`)
    const srcFile = `${srcPath}/watchFull.js`
    fs.writeFileSync(srcFile, rawContents)
    expect.assertions(2)
    watchFull()
    expect(beginWatcher).toHaveBeenCalled()
    expect(runOnChange).toHaveBeenCalled()
  })
})
