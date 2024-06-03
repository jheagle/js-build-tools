"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dotGet = void 0;
var _isObject = require("./isObject.js");
var _strAfter = require("./strAfter.js");
var _strBefore = require("./strBefore.js");
/**
 * Get a nested property value from an object.
 * Original source concepts from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/objects/dotGet.ts Sí, funciona}
 * @param {Object} arrayObject - The array or object to get the property from
 * @param {string} dotNotation - The path to the property
 * @param {string|null} [defaultValue=null] - The default value to return if the property is not found
 * @returns {*} The value of the property
 */
const dotGet = function (arrayObject, dotNotation) {
  let defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  let key = (0, _strBefore.strBefore)(dotNotation, '.');
  const lastKey = !key;
  if (lastKey) {
    key = dotNotation;
  }
  if (key === '*') {
    const result = [];
    for (let wildKey in arrayObject) {
      const wildValue = arrayObject[wildKey];
      if (lastKey) {
        result[wildKey] = wildValue;
        continue;
      }
      if (!(0, _isObject.isObject)(wildValue)) {
        continue;
      }
      result[wildKey] = dotGet(wildValue, (0, _strAfter.strAfter)(dotNotation, '.'), defaultValue);
    }
    return result;
  }
  if (lastKey) {
    return arrayObject[dotNotation] ?? defaultValue;
  }
  if (typeof arrayObject[key] === 'undefined') {
    return defaultValue;
  }
  const next = arrayObject[key];
  if (!(0, _isObject.isObject)(next)) {
    return defaultValue;
  }
  return dotGet(next, (0, _strAfter.strAfter)(dotNotation, '.'), defaultValue);
};
exports.dotGet = dotGet;