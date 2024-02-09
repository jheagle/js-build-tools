"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/web.url.js");
require("core-js/modules/web.url-search-params.js");
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodeProcess = _interopRequireDefault(require("node:process"));
var _nodeUrl = require("node:url");
var _binWrapper = _interopRequireDefault(require("bin-wrapper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const pkg = JSON.parse(_nodeFs.default.readFileSync(new URL('../package.json', require('url').pathToFileURL(__filename).toString())));
const url = "https://raw.githubusercontent.com/imagemin/mozjpeg-bin/v".concat(pkg.version, "/vendor/");
const binWrapper = new _binWrapper.default().src("".concat(url, "macos/cjpeg"), 'darwin').src("".concat(url, "linux/cjpeg"), 'linux').src("".concat(url, "win/cjpeg.exe"), 'win32').dest((0, _nodeUrl.fileURLToPath)(new URL('../vendor', require('url').pathToFileURL(__filename).toString()))).use(_nodeProcess.default.platform === 'win32' ? 'cjpeg.exe' : 'cjpeg');
var _default = exports.default = binWrapper;