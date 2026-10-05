import { execFileSync } from 'child_process'
import path from 'path'
import * as esmConfig from '../gulp.config.mjs'

const root = path.resolve(__dirname, '..')
const readFromCjs = (dotPath) => JSON.parse(execFileSync(process.execPath, [
  '-e',
  `console.log(JSON.stringify(require('./gulp.config.js').get(${JSON.stringify(dotPath)})))`
], { cwd: root }).toString())

describe('gulp.config entries', () => {
  test('the CommonJS entry exposes the same configuration as the ESM source', () => {
    for (const dotPath of ['docs', 'browser', 'dist', 'typescript']) {
      expect(readFromCjs(dotPath)).toEqual(JSON.parse(JSON.stringify(esmConfig.get(dotPath))))
    }
  })

  test('the CommonJS entry carries browser.bundles and browser.ignore/exclude', () => {
    for (const dotPath of ['browser.bundles', 'browser.ignore', 'browser.exclude']) {
      expect(readFromCjs(dotPath)).toEqual(JSON.parse(JSON.stringify(esmConfig.get(dotPath))))
    }
  })
})
