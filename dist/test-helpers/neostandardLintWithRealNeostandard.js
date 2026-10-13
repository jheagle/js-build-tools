"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.neostandardLint = exports.loadEslintViaSubprocess = void 0;
require("core-js/modules/es.json.stringify.js");
var _nodeChild_process = require("node:child_process");
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Jest's CommonJS transform cannot load `neostandard` (ESM-only) or run a real dynamic import(), so tests that need
// genuine neostandard behavior run the actual package in a plain Node subprocess instead of faking it.
const script = 'import { readFileSync } from \'node:fs\'\n' + 'import { ESLint } from \'eslint\'\n' + 'import { neostandard } from \'neostandard\'\n' + 'const { text, filePath, cwd, fix, ts, env } = JSON.parse(readFileSync(0, \'utf8\'))\n' + 'const eslint = new ESLint({ cwd, fix, overrideConfigFile: true, baseConfig: neostandard({ ts, env }) })\n' + 'process.stdout.write(JSON.stringify(await eslint.lintText(text, { filePath })))\n';
const readEnv = cwd => {
  try {
    return JSON.parse(_nodeFs.default.readFileSync(_nodePath.default.join(cwd, 'package.json'), 'utf8')).standard?.env ?? [];
  } catch {
    return [];
  }
};
const loadEslintViaSubprocess = ({
  cwd,
  ts,
  fix
}) => Promise.resolve({
  lintText: (text, {
    filePath
  }) => Promise.resolve().then(() => JSON.parse((0, _nodeChild_process.execFileSync)(process.execPath, ['--input-type=module', '--eval', script], {
    input: JSON.stringify({
      text,
      filePath,
      cwd,
      fix,
      ts,
      env: readEnv(cwd)
    }),
    encoding: 'utf8',
    cwd,
    maxBuffer: 256 * 1024 * 1024
  })))
});
exports.loadEslintViaSubprocess = loadEslintViaSubprocess;
const actual = jest.requireActual('../partials/neostandardLint.js');

// Drop-in replacement for the partial module (see jest.mock in the lint/build tests): same API, real neostandard.
const neostandardLint = options => actual.neostandardLint(options, loadEslintViaSubprocess);
exports.neostandardLint = neostandardLint;