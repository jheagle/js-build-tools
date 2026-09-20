import { execFileSync } from 'node:child_process'

// Jest's CommonJS transform cannot load `standard` (ESM-only) or run a real dynamic import(), so tests that need
// genuine Standard behavior run the actual `standard` package in a plain Node subprocess instead of faking it.
const script = 'import { readFileSync } from \'node:fs\'\n' +
  'import standard from \'standard\'\n' +
  'const { text, options } = JSON.parse(readFileSync(0, \'utf8\'))\n' +
  'process.stdout.write(JSON.stringify(await standard.lintText(text, options)))\n'

export const loadStandardViaSubprocess = () => Promise.resolve({
  lintText: (text, options) => Promise.resolve().then(() => JSON.parse(execFileSync(
    process.execPath,
    ['--input-type=module', '--eval', script],
    { input: JSON.stringify({ text, options }), encoding: 'utf8', cwd: process.cwd(), maxBuffer: 256 * 1024 * 1024 }
  )))
})

const actual = jest.requireActual('../partials/standardLint.mjs')

// Drop-in replacement for the partial module (see jest.mock in the lint/build tests): same API, real Standard.
export const standardLint = (options) => actual.standardLint(options, loadStandardViaSubprocess)
