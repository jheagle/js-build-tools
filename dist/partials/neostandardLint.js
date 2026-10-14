"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.neostandardLint = void 0;
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.for-each.js");
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));
var _through = _interopRequireDefault(require("through2"));
var _eslint = require("eslint");
var _loadPeer = require("./loadPeer.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// neostandard (js-build-tools' chosen style - a maintained, TypeScript-aware successor to `standard`, see
// https://github.com/neostandard/neostandard) ships ESM-only, see importModule for how it is imported.
const importNeostandard = () => (0, _loadPeer.importModule)('neostandard');

/**
 * Read the `env` a project already declared for Standard (the `standard` field in its package.json), so a project
 * migrating from `standard` keeps its globals (jest, browser, ...) without touching package.json.
 * @param {string} cwd
 * @returns {Array<string>}
 */
const readEnv = cwd => {
  try {
    return JSON.parse(_nodeFs.default.readFileSync(_nodePath.default.join(cwd, 'package.json'), 'utf8')).standard?.env ?? [];
  } catch {
    return [];
  }
};

/**
 * Build an ESLint instance configured with neostandard, honoring the project's own package.json `standard.env`,
 * plus an optional layer of rule overrides (see gulp.config.mjs's `lint.rules`) for a rule that is wrong for this
 * project specifically rather than something to fix in its code - for example a test fixture whose content
 * neostandard mistakes for a real syntax problem. Scoped to the same files neostandard itself lints (its own
 * `defaultFilePatterns.all`), per neostandard's own guidance: an unscoped rule-tweak layer would otherwise apply
 * to every lintable file, including ones from an unrelated plugin this project never defined.
 * @param {Object} options
 * @param {string} options.cwd
 * @param {boolean} options.ts
 * @param {boolean} options.fix
 * @param {Object<string, *>} [options.rules={}]
 * @returns {Promise<import('eslint').ESLint>}
 */
const buildEslint = async ({
  cwd,
  ts,
  fix,
  rules = {}
}) => {
  const {
    neostandard,
    defaultFilePatterns
  } = await importNeostandard();
  const baseConfig = neostandard({
    ts,
    env: readEnv(cwd)
  });
  if (Object.keys(rules).length) {
    baseConfig.push({
      files: defaultFilePatterns.all,
      rules
    });
  }
  return new _eslint.ESLint({
    cwd,
    fix,
    overrideConfigFile: true,
    baseConfig
  });
};

/**
 * Print a file's lint messages, if it has any.
 * @memberOf module:partials
 * @param {import('vinyl')} file
 * @param {{messages: Array<{line: number, column: number, message: string}>, errorCount: number, warningCount: number}} result
 * @returns {undefined}
 */
const printFileReport = (file, result) => {
  if (!result.messages.length) {
    return;
  }
  console.log(_nodePath.default.relative(file.cwd, file.path));
  result.messages.forEach(({
    line,
    column,
    message
  }) => console.log(`line ${line}:${column}\t${message}`));
  console.log(`✖ ${result.errorCount} error\t⚠ ${result.warningCount} warning\n`);
};

/**
 * Lint every file streaming through with neostandard and, unless `fix` is false, apply the automatic fixes to the
 * file's contents so a following `dest()` writes the fixed version. Remaining problems are printed along with a
 * summary once the stream ends; they never fail the build.
 *
 * One ESLint instance is built from the first file's own cwd and reused for the rest of the stream, since every
 * file in a given lint pass shares the same project (and so the same config).
 * @memberOf module:partials
 * @param {Object} [options={}]
 * @param {boolean} [options.fix=true] - Apply neostandard's automatic fixes to the file contents.
 * @param {boolean} [options.ts=false] - Lint `.ts` files too, with type-aware rules (see neostandard's `ts` option).
 * @param {Object<string, *>} [options.rules={}] - ESLint rule overrides layered on top of neostandard's own rules
 * (see gulp.config.mjs's `lint.rules`).
 * @param {function(Object): Promise<{lintText: Function}>} [loadEslint] - Resolves an ESLint-shaped linter. Real
 * callers should never need to pass this - it exists so tests can supply a stand-in, since this project's
 * CommonJS-transform-based Jest setup cannot execute a real dynamic import() of neostandard (ESM-only).
 * @returns {import('stream').Transform}
 */
const neostandardLint = ({
  fix = true,
  ts = false,
  rules = {}
} = {}, loadEslint = buildEslint) => {
  const totals = {
    errors: 0,
    warnings: 0
  };
  let eslintPromise = null;
  return _through.default.obj(function (file, enc, callback) {
    if (file.isNull()) {
      callback(null, file);
      return;
    }
    if (file.isStream()) {
      callback(new Error('neostandardLint: streaming file contents are not supported.'));
      return;
    }
    if (!eslintPromise) {
      eslintPromise = loadEslint({
        cwd: file.cwd,
        ts,
        fix,
        rules
      });
    }
    eslintPromise.then(eslint => eslint.lintText(file.contents.toString(), {
      filePath: file.path
    })).then(results => {
      // No result at all means the file is ignored by the project's ESLint configuration.
      const [result] = results;
      if (result) {
        if (typeof result.output === 'string') {
          file.contents = Buffer.from(result.output);
        }
        totals.errors += result.errorCount;
        totals.warnings += result.warningCount;
        printFileReport(file, result);
      }
      callback(null, file);
    }, callback);
  }, function (callback) {
    console.log('neostandard linter results');
    console.log('======================================');
    console.log(`✖ Errors total: ${totals.errors}`);
    console.log(`⚠ Warnings total: ${totals.warnings}\n`);
    callback();
  });
};
exports.neostandardLint = neostandardLint;