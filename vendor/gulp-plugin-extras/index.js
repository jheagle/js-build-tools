async function exportGulpPluginExtras () {
  "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gulpPlugin = gulpPlugin;
require("core-js/modules/web.dom-collections.iterator.js");
var _index = _interopRequireDefault(require("../easy-transform-stream/index.js"));
var _pluginError = _interopRequireDefault(require("./plugin-error.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function gulpPlugin(name, onFile) {
  let {
    onFinish,
    supportsDirectories
  } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return (0, _index.default)({
    objectMode: true
  }, async file => {
    if (file.isNull() && !(supportsDirectories && file.isDirectory())) {
      return file;
    }
    if (file.isStream()) {
      throw new _pluginError.default(name, 'Streaming not supported');
    }
    try {
      return await onFile(file);
    } catch (error) {
      throw new _pluginError.default(name, error, {
        fileName: file.path,
        showStack: true
      });
    }
  }, onFinish && async function* (stream) {
    try {
      yield* onFinish(stream);
    } catch (error) {
      throw new _pluginError.default(name, error, {
        showStack: true
      });
    }
  });
}
}

exportGulpPluginExtras()