"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dotNotate = void 0;
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.map.js");
var _isObject = require("./isObject.js");
/**
 * Convert an array of keys into a regex, return a function to test if incoming keys match.
 * @param {Array.<string>} [retainObjects=[]] - An array of keys to retain as objects
 * @returns {Function} The dot-notated array
 */
const handleRetainObjects = function () {
  let retainObjects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  if (!retainObjects.length) {
    /**
     * Bypass the test function if there are no retainObjects.
     * @returns {false}
     */
    return (currentKey, value, results) => false;
  }
  retainObjects = retainObjects.map(key => key.replace('\.', '\\.'));
  const retainRegex = new RegExp(`(${retainObjects.join('|')})$`);
  /**
   * Test if a key should be retained as an object.
   * @param {string} currentKey - The key to test
   * @param {*} value - The value of the key
   * @param {Object} results - The result object to add to
   * @returns {boolean}
   */
  return (currentKey, value, results) => {
    if (!currentKey.match(retainRegex)) {
      return false;
    }
    results[currentKey] = value;
    return true;
  };
};

/**
 * The underlying logic function for converting arrays to dot-notation.
 * @param {Object} arrayObject - The array or object to dot-notate
 * @param {Function} didRetain - The test function to see if a key should be retained
 * @param {string} [prepend=''] - The path for the property being processed
 * @param {Object<string, *>} [results={}] - The final notated object to return
 * @returns {Object<string, *>} The dot-notated object
 */
const performDotNotate = function (arrayObject, didRetain) {
  let prepend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  let results = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  for (let key in arrayObject) {
    const value = arrayObject[key];
    const currentKey = `${prepend}${key}`;
    if (didRetain(currentKey, value, results)) {
      continue;
    }
    if ((0, _isObject.isObject)(value)) {
      performDotNotate(value, didRetain, `${currentKey}.`, results);
      continue;
    }
    results[currentKey] = value;
  }
  return results;
};

/**
 * Convert an array or object to a single dimensional associative array with dot notation.
 * Original source concepts from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/objects/dotNotate.ts Sí, funciona}
 * @param {Object} arrayObject - The array or object to dot-notate
 * @param {Array.<string>} [retainObjects=[]] - An array of keys to retain as objects
 * @returns {Object<string, *>} The dot-notated object
 */
const dotNotate = function (arrayObject) {
  let retainObjects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return performDotNotate(arrayObject, handleRetainObjects(retainObjects));
};
exports.dotNotate = dotNotate;