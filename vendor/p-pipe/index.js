async function exportPPipe () {
  "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pPipe;
require("core-js/modules/web.dom-collections.iterator.js");
function pPipe() {
  for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
    functions[_key] = arguments[_key];
  }
  if (functions.length === 0) {
    throw new Error('Expected at least one argument');
  }
  return async input => {
    let currentValue = input;
    for (const function_ of functions) {
      currentValue = await function_(currentValue); // eslint-disable-line no-await-in-loop
    }
    return currentValue;
  };
}
}

exportPPipe()