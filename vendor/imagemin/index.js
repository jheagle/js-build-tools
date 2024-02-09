async function exportImagemin () {
  "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = imagemin;
require("core-js/modules/esnext.async-iterator.filter.js");
require("core-js/modules/esnext.async-iterator.map.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.filter.js");
require("core-js/modules/esnext.iterator.map.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _nodeBuffer = require("node:buffer");
var _nodeFs = require("node:fs");
var _nodeUtil = require("node:util");
var _nodePath = _interopRequireDefault(require("node:path"));
var _gracefulFs = _interopRequireDefault(require("graceful-fs"));
var _fileType = _interopRequireDefault(require("file-type"));
var _index = require("../globby/index.js");
var _index2 = _interopRequireDefault(require("../p-pipe/index.js"));
var _replaceExt = _interopRequireDefault(require("replace-ext"));
var _index3 = _interopRequireDefault(require("../junk/index.js"));
var _index4 = _interopRequireDefault(require("../slash/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const readFile = (0, _nodeUtil.promisify)(_gracefulFs.default.readFile);
const writeFile = (0, _nodeUtil.promisify)(_gracefulFs.default.writeFile);
const handleFile = async (sourcePath, _ref) => {
  let {
    destination,
    plugins = []
  } = _ref;
  if (plugins && !Array.isArray(plugins)) {
    throw new TypeError('The `plugins` option should be an `Array`');
  }
  let data = await readFile(sourcePath);
  data = await (plugins.length > 0 ? (0, _index2.default)(...plugins)(data) : data);
  const {
    ext
  } = (await _fileType.default.fromBuffer(data)) || {
    ext: _nodePath.default.extname(sourcePath)
  };
  let destinationPath = destination ? _nodePath.default.join(destination, _nodePath.default.basename(sourcePath)) : undefined;
  destinationPath = ext === 'webp' ? (0, _replaceExt.default)(destinationPath, '.webp') : destinationPath;
  const returnValue = {
    data,
    sourcePath,
    destinationPath
  };
  if (!destinationPath) {
    return returnValue;
  }
  await _nodeFs.promises.mkdir(_nodePath.default.dirname(returnValue.destinationPath), {
    recursive: true
  });
  await writeFile(returnValue.destinationPath, returnValue.data);
  return returnValue;
};
async function imagemin(input) {
  let {
    glob = true,
    ...options
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!Array.isArray(input)) {
    throw new TypeError("Expected an `Array`, got `".concat(typeof input, "`"));
  }
  const unixFilePaths = input.map(path => (0, _index4.default)(path));
  const filePaths = glob ? await (0, _index.globby)(unixFilePaths, {
    onlyFiles: true
  }) : input;
  return Promise.all(filePaths.filter(filePath => _index3.default.not(_nodePath.default.basename(filePath))).map(async filePath => {
    try {
      return await handleFile(filePath, options);
    } catch (error) {
      error.message = "Error occurred when handling file: ".concat(input, "\n\n").concat(error.stack);
      throw error;
    }
  }));
}
imagemin.buffer = async function (input) {
  let {
    plugins = []
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!_nodeBuffer.Buffer.isBuffer(input)) {
    throw new TypeError("Expected a `Buffer`, got `".concat(typeof input, "`"));
  }
  if (plugins.length === 0) {
    return input;
  }
  return (0, _index2.default)(...plugins)(input);
};
}

exportImagemin()