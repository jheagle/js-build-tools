"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isObject = void 0;
/**
 * Check if the provided thing is an object / array.
 * Original source concepts from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/objects/isObject.ts Sí, funciona}
 * @param {*} object
 * @returns {boolean}
 */
const isObject = object => typeof object === 'object' && object !== null;
exports.isObject = isObject;