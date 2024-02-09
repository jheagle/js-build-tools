async function exportEasyTransformStream () {
  "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformStream;
require("core-js/modules/web.dom-collections.iterator.js");
var _nodeStream = require("node:stream");
function transformStream() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let transformer = arguments.length > 1 ? arguments[1] : undefined;
  let flusher = arguments.length > 2 ? arguments[2] : undefined;
  if (typeof options === 'function') {
    flusher = transformer;
    transformer = options;
  }
  return new _nodeStream.Transform({
    ...options,
    transform(chunk, encoding, callback) {
      (async () => {
        try {
          const value = await transformer(chunk, encoding, this);

          // If the callback throws, we don't want to cause an infinite recursion.
          try {
            callback(undefined, value);
          } catch {}
        } catch (error) {
          callback(error);
        }
      })();
    },
    flush(callback) {
      if (typeof flusher !== 'function') {
        callback();
        return;
      }
      (async () => {
        try {
          for await (const chunk of flusher(this)) {
            this.push(chunk);
          }

          // If the callback throws, we don't want to cause an infinite recursion.
          try {
            callback();
          } catch {}
        } catch (error) {
          callback(error);
        }
      })();
    }
  });
}
}

exportEasyTransformStream()