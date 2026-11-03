import { execFileSync } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'

const root = path.resolve(import.meta.dirname, '..')
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))

const exportTargets = (value) => typeof value === 'string' ? [value] : Object.values(value).flatMap(exportTargets)

describe('package entry points', () => {
  test('every "exports" target names its file extension and has a file behind it', () => {
    const targets = Object.values(packageJson.exports).flatMap(exportTargets)
    expect(targets.length).toBeGreaterThan(0)
    // An extensionless target (./dist/testHelpers) can't be resolved by require() or import
    expect(targets.filter((target) => !/\.[cm]?js$/.test(target))).toEqual([])
    // dist/ isn't committed (built by the build), so a dist target is checked against its source in functions/
    const sourceOf = (target) => target.startsWith('./dist/') ? target.replace(/^\.\/dist\//, './functions/').replace(/\.js$/, '.mjs') : target
    const missing = targets.filter((target) => !fs.existsSync(path.join(root, sourceOf(target))))
    expect(missing).toEqual([])
  })

  test('without a build-tools.config.json, the config warns and falls back to the defaults', () => {
    const emptyProject = fs.mkdtempSync(path.join(os.tmpdir(), 'no-config-'))
    try {
      // A child process: gulp.config.mjs reads the config once, from the working directory, when it is first loaded
      const output = execFileSync(process.execPath, [
        '--input-type=module',
        '-e',
        `const c = await import(${JSON.stringify(path.join(root, 'gulp.config.mjs'))}); console.log('browser.to=' + c.get('browser.to'))`
      ], { cwd: emptyProject, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
      expect(output).toContain('browser.to=browser')
    } finally {
      fs.rmSync(emptyProject, { recursive: true, force: true })
    }
  })
})
