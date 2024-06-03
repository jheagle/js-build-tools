import * as setUp from '../test-helpers/setUp.mjs'
import { beginWatcher } from './beginWatcher.mjs'
import { EventEmitter } from 'node:events'

setUp.setDefaults('test-begin-watcher')
const gulpConfig = setUp.gulpConfig

beforeEach(setUp.beforeEach)

afterEach(setUp.afterEach)

describe('beginWatcher', () => {
  test('returns instance of EventEmitter / FSWatcher', () => {
    gulpConfig.set('test.watch', 'test-begin-watcher/*.js')
    const fsWatcher = beginWatcher()
    expect(fsWatcher).toBeInstanceOf(EventEmitter)
    fsWatcher.close()
  })
})
