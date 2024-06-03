"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dotSet = void 0;
var _isObject = require("./isObject.js");
var _strAfter = require("./strAfter.js");
var _strBefore = require("./strBefore.js");
/**
 * Set a nested property value an object.
 * Original source concepts from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/objects/dotSet.ts Sí, funciona}
 * @param {Object} arrayObject - The array or object to set the property on
 * @param {string} dotNotation - The path for the property
 * @param {*} value - The default value to return if the property is not found
 * @returns {Object} The modified object
 */
const dotSet = function (arrayObject, dotNotation) {
  let value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  let key = (0, _strBefore.strBefore)(dotNotation, '.');
  const lastKey = !key;
  if (lastKey) {
    key = dotNotation;
  }
  if (key === '*') {
    for (let wildKey in arrayObject) {
      if (lastKey) {
        arrayObject[wildKey] = value;
        continue;
      }
      if (!(0, _isObject.isObject)(arrayObject[wildKey])) {
        continue;
      }
      dotSet(arrayObject[wildKey], (0, _strAfter.strAfter)(dotNotation, '.'), value);
    }
    return arrayObject;
  }
  if (lastKey) {
    arrayObject[dotNotation] = value;
    return arrayObject;
  }
  const next = arrayObject[key] ?? [];
  arrayObject[key] = dotSet(next, (0, _strAfter.strAfter)(dotNotation, '.'), value);
  return arrayObject;
};
exports.dotSet = dotSet;