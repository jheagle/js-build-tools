"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.standardLint = exports.loadStandardViaSubprocess = void 0;
require("core-js/modules/es.json.stringify.js");
var _nodeChild_process = require("node:child_process");
// Jest's CommonJS transform cannot load `standard` (ESM-only) or run a real dynamic import(), so tests that need
// genuine Standard behavior run the actual `standard` package in a plain Node subprocess instead of faking it.
const script = 'import { readFileSync } from \'node:fs\'\n' + 'import standard from \'standard\'\n' + 'const { text, options } = JSON.parse(readFileSync(0, \'utf8\'))\n' + 'process.stdout.write(JSON.stringify(await standard.lintText(text, options)))\n';
const loadStandardViaSubprocess = () => Promise.resolve({
  lintText: (text, options) => Promise.resolve().then(() => JSON.parse((0, _nodeChild_process.execFileSync)(process.execPath, ['--input-type=module', '--eval', script], {
    input: JSON.stringify({
      text,
      options
    }),
    encoding: 'utf8',
    cwd: process.cwd(),
    maxBuffer: 256 * 1024 * 1024
  })))
});
exports.loadStandardViaSubprocess = loadStandardViaSubprocess;
const actual = jest.requireActual('../partials/standardLint.js');

// Drop-in replacement for the partial module (see jest.mock in the lint/build tests): same API, real Standard.
const standardLint = options => actual.standardLint(options, loadStandardViaSubprocess);
exports.standardLint = standardLint;