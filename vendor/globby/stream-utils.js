"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UniqueStream = exports.FilterStream = void 0;
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
var _nodeStream = require("node:stream");
class ObjectTransform extends _nodeStream.Transform {
  constructor() {
    super({
      objectMode: true
    });
  }
}
class FilterStream extends ObjectTransform {
  constructor(filter) {
    super();
    this._filter = filter;
  }
  _transform(data, encoding, callback) {
    if (this._filter(data)) {
      this.push(data);
    }
    callback();
  }
}
exports.FilterStream = FilterStream;
class UniqueStream extends ObjectTransform {
  constructor() {
    super();
    this._pushed = new Set();
  }
  _transform(data, encoding, callback) {
    if (!this._pushed.has(data)) {
      this.push(data);
      this._pushed.add(data);
    }
    callback();
  }
}
exports.UniqueStream = UniqueStream;