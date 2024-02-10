"use strict";

const isObject = require('./isObject');
const strAfter = require('common-exports/dist/utilities/strAfter').default;
const strBefore = require('common-exports/dist/utilities/strBefore').default;

/**
 * Set a nested property value an object.
 * Original source concepts from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/objects/dotSet.ts Sí, funciona}
 * @param {Object} arrayObject - The array or object to set the property on
 * @param {string} dotNotation - The path for the property
 * @param {*} value - The default value to return if the property is not found
 * @returns {Object} The modified object
 */
const dotSet = function (arrayObject, dotNotation) {
  var _arrayObject$key;
  let value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  let key = strBefore(dotNotation, '.');
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
      if (!isObject(arrayObject[wildKey])) {
        continue;
      }
      dotSet(arrayObject[wildKey], strAfter(dotNotation, '.'), value);
    }
    return arrayObject;
  }
  if (lastKey) {
    arrayObject[dotNotation] = value;
    return arrayObject;
  }
  const next = (_arrayObject$key = arrayObject[key]) !== null && _arrayObject$key !== void 0 ? _arrayObject$key : [];
  arrayObject[key] = dotSet(next, strAfter(dotNotation, '.'), value);
  return arrayObject;
};
module.exports = dotSet;