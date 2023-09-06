const setUp = require('../test-helpers/setUp')
setUp.setDefaults('test-begin-watcher')
const gulpConfig = setUp.gulpConfig
const beginWatcher = require('./beginWatcher')
const { EventEmitter } = require('node:events')

beforeEach(setUp.beforeEach)

afterEach(setUp.afterEach)

describe('beginWatcher', () => {
  test('returns instance of EventEmitter / FSWatcher', () => {
    gulpConfig.set('watchSearch', 'test-begin-watcher/*.js')
    const fsWatcher = beginWatcher()
    expect(fsWatcher).toBeInstanceOf(EventEmitter)
    fsWatcher.close()
  })
})
