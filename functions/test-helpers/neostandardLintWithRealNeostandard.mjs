import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

// Jest's CommonJS transform cannot load `neostandard` (ESM-only) or run a real dynamic import(), so tests that need
// genuine neostandard behavior run the actual package in a plain Node subprocess instead of faking it.
const script = 'import { readFileSync } from \'node:fs\'\n' +
  'import { ESLint } from \'eslint\'\n' +
  'import { neostandard } from \'neostandard\'\n' +
  'const { text, filePath, cwd, fix, ts, env } = JSON.parse(readFileSync(0, \'utf8\'))\n' +
  'const eslint = new ESLint({ cwd, fix, overrideConfigFile: true, baseConfig: neostandard({ ts, env }) })\n' +
  'process.stdout.write(JSON.stringify(await eslint.lintText(text, { filePath })))\n'

const readEnv = cwd => {
  try {
    return JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8')).standard?.env ?? []
  } catch {
    return []
  }
}

export const loadEslintViaSubprocess = ({ cwd, ts, fix }) => Promise.resolve({
  lintText: (text, { filePath }) => Promise.resolve().then(() => JSON.parse(execFileSync(
    process.execPath,
    ['--input-type=module', '--eval', script],
    {
      input: JSON.stringify({ text, filePath, cwd, fix, ts, env: readEnv(cwd) }),
      encoding: 'utf8',
      cwd,
      maxBuffer: 256 * 1024 * 1024
    }
  )))
})

const actual = jest.requireActual('../partials/neostandardLint.mjs')

// Drop-in replacement for the partial module (see jest.mock in the lint/build tests): same API, real neostandard.
export const neostandardLint = (options) => actual.neostandardLint(options, loadEslintViaSubprocess)
