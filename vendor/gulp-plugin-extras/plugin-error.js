"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/esnext.async-iterator.filter.js");
require("core-js/modules/esnext.async-iterator.map.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.filter.js");
require("core-js/modules/esnext.iterator.map.js");
require("core-js/modules/esnext.set.add-all.js");
require("core-js/modules/esnext.set.delete-all.js");
require("core-js/modules/esnext.set.difference.js");
require("core-js/modules/esnext.set.every.js");
require("core-js/modules/esnext.set.filter.js");
require("core-js/modules/esnext.set.find.js");
require("core-js/modules/esnext.set.intersection.js");
require("core-js/modules/esnext.set.is-disjoint-from.js");
require("core-js/modules/esnext.set.is-subset-of.js");
require("core-js/modules/esnext.set.is-superset-of.js");
require("core-js/modules/esnext.set.join.js");
require("core-js/modules/esnext.set.map.js");
require("core-js/modules/esnext.set.reduce.js");
require("core-js/modules/esnext.set.some.js");
require("core-js/modules/esnext.set.symmetric-difference.js");
require("core-js/modules/esnext.set.union.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _index = _interopRequireDefault(require("./node_modules/chalk/source/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*
The MIT License (MIT)

Copyright (c) 2015, 2017-2018, 2022 Blaine Bublitz <blaine.bublitz@gmail.com> and Eric Schoffstall <yo@contra.io>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Adapted from https://github.com/gulpjs/plugin-error 2.0.1

const nonEnum = ['message', 'name', 'stack'];
const ignored = new Set([...nonEnum, '__safety', '_stack', 'plugin', 'showProperties', 'showStack', 'domain', 'domainEmitter', 'domainThrown']);
const props = ['fileName', 'lineNumber', 'message', 'name', 'plugin', 'showProperties', 'showStack', 'stack'];
class PluginError extends Error {
  constructor(plugin, message, options) {
    super();
    const options_ = setDefaults(plugin, message, options);
    Object.assign(this, options_);
    if (typeof options_.error === 'object') {
      this.message = options_.error.message;
      this.stack = options_.error.stack;
      this.cause = options_.error.cause;
      Object.assign(this, options_.error);
    }
    for (const prop of props) {
      if (prop in options_) {
        this[prop] = options_[prop];
      }
    }
    if (!this.stack) {
      const safety = {
        toString: this._messageWithDetails.bind(this) + '\nStack:'
      };
      Error.captureStackTrace(safety, this.constructor);
      this.__safety = safety;
    }
    if (!this.plugin) {
      throw new Error('Missing plugin name');
    }
    if (!this.message) {
      throw new Error('Missing error message');
    }
    if (message instanceof Error && options_.error.isPresentable) {
      this.showStack = false;
      this.showProperties = false;
    }
  }
  _messageWithDetails() {
    let message_ = "Message:\n    ".concat(this.message);
    const details = this._messageDetails();
    if (details) {
      message_ += "\n".concat(details);
    }
    return message_;
  }
  _messageDetails() {
    if (!this.showProperties) {
      return '';
    }
    const relevantProps = Object.keys(this).filter(key => !ignored.has(key));
    return relevantProps.length > 0 ? "Details:\n".concat(relevantProps.map(prop => "    ".concat(prop, ": ").concat(this[prop])).join('\n')) : '';
  }
  toString() {
    const message_ = this.showStack ? this.__safety ? this.__safety.stack : this.stack : this._messageWithDetails();
    return formatMessage(message_, this);
  }
}
exports.default = PluginError;
function formatMessage(message, thisArg) {
  return "".concat(_index.default.red(thisArg.name), " in plugin \"").concat(_index.default.cyan(thisArg.plugin), "\"\n").concat(message);
}
function setDefaults(plugin, message, options) {
  if (typeof plugin === 'object') {
    return {
      ...plugin
    };
  }
  if (message instanceof Error) {
    options = {
      ...options,
      error: message
    };
  } else if (typeof message === 'object') {
    options = {
      ...message
    };
  } else {
    options = {
      ...options,
      message
    };
  }
  options.plugin = plugin;
  return {
    showStack: false,
    showProperties: true,
    ...options
  };
}