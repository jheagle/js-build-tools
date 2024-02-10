/**
 * Check if the provided thing is an object / array.
 * Original source concepts from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/objects/isObject.ts Sí, funciona}
 * @param {*} object
 * @returns {boolean}
 */
const isObject = (object) => typeof object === 'object' && object !== null

module.exports = isObject
