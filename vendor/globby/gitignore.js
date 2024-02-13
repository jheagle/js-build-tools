"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isGitIgnoredSync = exports.isGitIgnored = void 0;
require("core-js/modules/esnext.async-iterator.filter.js");
require("core-js/modules/esnext.async-iterator.map.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.filter.js");
require("core-js/modules/esnext.iterator.map.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _nodeProcess = _interopRequireDefault(require("node:process"));
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));
var _fastGlob = _interopRequireDefault(require("fast-glob"));
var _index = _interopRequireDefault(require("../ignore/index.js"));
var _index2 = _interopRequireDefault(require("./node_modules/slash/index.js"));
var _toPath = _interopRequireDefault(require("./to-path.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DEFAULT_IGNORE = ['**/node_modules/**', '**/flow-typed/**', '**/coverage/**', '**/.git'];
const mapGitIgnorePatternTo = base => ignore => {
  if (ignore.startsWith('!')) {
    return '!' + _nodePath.default.posix.join(base, ignore.slice(1));
  }
  return _nodePath.default.posix.join(base, ignore);
};
const parseGitIgnore = (content, options) => {
  const base = (0, _index2.default)(_nodePath.default.relative(options.cwd, _nodePath.default.dirname(options.fileName)));
  return content.split(/\r?\n/).filter(Boolean).filter(line => !line.startsWith('#')).map(mapGitIgnorePatternTo(base));
};
const reduceIgnore = files => {
  const ignores = (0, _index.default)();
  for (const file of files) {
    ignores.add(parseGitIgnore(file.content, {
      cwd: file.cwd,
      fileName: file.filePath
    }));
  }
  return ignores;
};
const ensureAbsolutePathForCwd = (cwd, p) => {
  cwd = (0, _index2.default)(cwd);
  if (_nodePath.default.isAbsolute(p)) {
    if ((0, _index2.default)(p).startsWith(cwd)) {
      return p;
    }
    throw new Error("Path ".concat(p, " is not in cwd ").concat(cwd));
  }
  return _nodePath.default.join(cwd, p);
};
const getIsIgnoredPredicate = (ignores, cwd) => p => ignores.ignores((0, _index2.default)(_nodePath.default.relative(cwd, ensureAbsolutePathForCwd(cwd, (0, _toPath.default)(p.path || p)))));
const getFile = async (file, cwd) => {
  const filePath = _nodePath.default.join(cwd, file);
  const content = await _nodeFs.default.promises.readFile(filePath, 'utf8');
  return {
    cwd,
    filePath,
    content
  };
};
const getFileSync = (file, cwd) => {
  const filePath = _nodePath.default.join(cwd, file);
  const content = _nodeFs.default.readFileSync(filePath, 'utf8');
  return {
    cwd,
    filePath,
    content
  };
};
const normalizeOptions = function () {
  let {
    ignore = [],
    cwd = (0, _index2.default)(_nodeProcess.default.cwd())
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    ignore: [...DEFAULT_IGNORE, ...ignore],
    cwd: (0, _toPath.default)(cwd)
  };
};
const isGitIgnored = async options => {
  options = normalizeOptions(options);
  const paths = await (0, _fastGlob.default)('**/.gitignore', options);
  const files = await Promise.all(paths.map(file => getFile(file, options.cwd)));
  const ignores = reduceIgnore(files);
  return getIsIgnoredPredicate(ignores, options.cwd);
};
exports.isGitIgnored = isGitIgnored;
const isGitIgnoredSync = options => {
  options = normalizeOptions(options);
  const paths = _fastGlob.default.sync('**/.gitignore', options);
  const files = paths.map(file => getFileSync(file, options.cwd));
  const ignores = reduceIgnore(files);
  return getIsIgnoredPredicate(ignores, options.cwd);
};
exports.isGitIgnoredSync = isGitIgnoredSync;