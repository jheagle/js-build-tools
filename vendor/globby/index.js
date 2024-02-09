async function exportGlobby () {
  "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDynamicPattern = exports.globbySync = exports.globbyStream = exports.globby = exports.generateGlobTasks = void 0;
Object.defineProperty(exports, "isGitIgnored", {
  enumerable: true,
  get: function () {
    return _gitignore.isGitIgnored;
  }
});
Object.defineProperty(exports, "isGitIgnoredSync", {
  enumerable: true,
  get: function () {
    return _gitignore.isGitIgnoredSync;
  }
});
require("core-js/modules/es.array.unscopables.flat.js");
require("core-js/modules/esnext.async-iterator.every.js");
require("core-js/modules/esnext.async-iterator.filter.js");
require("core-js/modules/esnext.async-iterator.map.js");
require("core-js/modules/esnext.async-iterator.some.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.every.js");
require("core-js/modules/esnext.iterator.filter.js");
require("core-js/modules/esnext.iterator.map.js");
require("core-js/modules/esnext.iterator.some.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _index = _interopRequireDefault(require("../array-union/index.js"));
var _merge = _interopRequireDefault(require("merge2"));
var _fastGlob = _interopRequireDefault(require("fast-glob"));
var _dirGlob = _interopRequireDefault(require("dir-glob"));
var _toPath = _interopRequireDefault(require("./to-path.js"));
var _gitignore = require("./gitignore.js");
var _streamUtils = require("./stream-utils.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DEFAULT_FILTER = () => false;
const isNegative = pattern => pattern[0] === '!';
const assertPatternsInput = patterns => {
  if (!patterns.every(pattern => typeof pattern === 'string')) {
    throw new TypeError('Patterns must be a string or an array of strings');
  }
};
const checkCwdOption = options => {
  if (!options.cwd) {
    return;
  }
  let stat;
  try {
    stat = _nodeFs.default.statSync(options.cwd);
  } catch {
    return;
  }
  if (!stat.isDirectory()) {
    throw new Error('The `cwd` option must be a path to a directory');
  }
};
const getPathString = p => p.stats instanceof _nodeFs.default.Stats ? p.path : p;
const generateGlobTasks = function (patterns) {
  let taskOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  patterns = (0, _index.default)([patterns].flat());
  assertPatternsInput(patterns);
  const globTasks = [];
  taskOptions = {
    ignore: [],
    expandDirectories: true,
    ...taskOptions,
    cwd: (0, _toPath.default)(taskOptions.cwd)
  };
  checkCwdOption(taskOptions);
  for (const [index, pattern] of patterns.entries()) {
    if (isNegative(pattern)) {
      continue;
    }
    const ignore = patterns.slice(index).filter(pattern => isNegative(pattern)).map(pattern => pattern.slice(1));
    const options = {
      ...taskOptions,
      ignore: [...taskOptions.ignore, ...ignore]
    };
    globTasks.push({
      pattern,
      options
    });
  }
  return globTasks;
};
exports.generateGlobTasks = generateGlobTasks;
const globDirectories = (task, fn) => {
  let options = {};
  if (task.options.cwd) {
    options.cwd = task.options.cwd;
  }
  if (Array.isArray(task.options.expandDirectories)) {
    options = {
      ...options,
      files: task.options.expandDirectories
    };
  } else if (typeof task.options.expandDirectories === 'object') {
    options = {
      ...options,
      ...task.options.expandDirectories
    };
  }
  return fn(task.pattern, options);
};
const getPattern = (task, fn) => task.options.expandDirectories ? globDirectories(task, fn) : [task.pattern];
const getFilterSync = options => options && options.gitignore ? (0, _gitignore.isGitIgnoredSync)({
  cwd: options.cwd,
  ignore: options.ignore
}) : DEFAULT_FILTER;
const globToTask = task => async glob => {
  const {
    options
  } = task;
  if (options.ignore && Array.isArray(options.ignore) && options.expandDirectories) {
    options.ignore = await (0, _dirGlob.default)(options.ignore);
  }
  return {
    pattern: glob,
    options
  };
};
const globToTaskSync = task => glob => {
  const {
    options
  } = task;
  if (options.ignore && Array.isArray(options.ignore) && options.expandDirectories) {
    options.ignore = _dirGlob.default.sync(options.ignore);
  }
  return {
    pattern: glob,
    options
  };
};
const globby = async (patterns, options) => {
  const globTasks = generateGlobTasks(patterns, options);
  const getFilter = async () => options && options.gitignore ? (0, _gitignore.isGitIgnored)({
    cwd: options.cwd,
    ignore: options.ignore
  }) : DEFAULT_FILTER;
  const getTasks = async () => {
    const tasks = await Promise.all(globTasks.map(async task => {
      const globs = await getPattern(task, _dirGlob.default);
      return Promise.all(globs.map(globToTask(task)));
    }));
    return (0, _index.default)(...tasks);
  };
  const [filter, tasks] = await Promise.all([getFilter(), getTasks()]);
  const paths = await Promise.all(tasks.map(task => (0, _fastGlob.default)(task.pattern, task.options)));
  return (0, _index.default)(...paths).filter(path_ => !filter(getPathString(path_)));
};
exports.globby = globby;
const globbySync = (patterns, options) => {
  const globTasks = generateGlobTasks(patterns, options);
  const tasks = [];
  for (const task of globTasks) {
    const newTask = getPattern(task, _dirGlob.default.sync).map(globToTaskSync(task));
    tasks.push(...newTask);
  }
  const filter = getFilterSync(options);
  let matches = [];
  for (const task of tasks) {
    matches = (0, _index.default)(matches, _fastGlob.default.sync(task.pattern, task.options));
  }
  return matches.filter(path_ => !filter(path_));
};
exports.globbySync = globbySync;
const globbyStream = (patterns, options) => {
  const globTasks = generateGlobTasks(patterns, options);
  const tasks = [];
  for (const task of globTasks) {
    const newTask = getPattern(task, _dirGlob.default.sync).map(globToTaskSync(task));
    tasks.push(...newTask);
  }
  const filter = getFilterSync(options);
  const filterStream = new _streamUtils.FilterStream(p => !filter(p));
  const uniqueStream = new _streamUtils.UniqueStream();
  return (0, _merge.default)(tasks.map(task => _fastGlob.default.stream(task.pattern, task.options))).pipe(filterStream).pipe(uniqueStream);
};
exports.globbyStream = globbyStream;
const isDynamicPattern = function (patterns) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  options = {
    ...options,
    cwd: (0, _toPath.default)(options.cwd)
  };
  return [patterns].flat().some(pattern => _fastGlob.default.isDynamicPattern(pattern, options));
};
exports.isDynamicPattern = isDynamicPattern;
}

exportGlobby()