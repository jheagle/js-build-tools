"use strict";

const isObject = require('./isObject');
const strAfter = require('./strAfter');
const strBefore = require('./strBefore');

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
  let key = strBefore(dotNotation, '.');
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
      if (!isObject(wildValue)) {
        continue;
      }
      result[wildKey] = dotGet(wildValue, strAfter(dotNotation, '.'), defaultValue);
    }
    return result;
  }
  if (lastKey) {
    var _arrayObject$dotNotat;
    return (_arrayObject$dotNotat = arrayObject[dotNotation]) !== null && _arrayObject$dotNotat !== void 0 ? _arrayObject$dotNotat : defaultValue;
  }
  if (typeof arrayObject[key] === 'undefined') {
    return defaultValue;
  }
  const next = arrayObject[key];
  if (!isObject(next)) {
    return defaultValue;
  }
  return dotGet(next, strAfter(dotNotation, '.'), defaultValue);
};
module.exports = dotGet;