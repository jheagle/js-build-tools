"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/web.url.js");
require("core-js/modules/web.url-search-params.js");
var _nodeUrl = require("node:url");
const toPath = urlOrPath => {
  if (!urlOrPath) {
    return urlOrPath;
  }
  if (urlOrPath instanceof URL) {
    urlOrPath = urlOrPath.href;
  }
  return urlOrPath.startsWith('file://') ? (0, _nodeUrl.fileURLToPath)(urlOrPath) : urlOrPath;
};
var _default = exports.default = toPath;