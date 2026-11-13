import { isObject } from './isObject.mjs'
import { strAfter } from './strAfter.mjs'
import { strBefore } from './strBefore.mjs'

/**
 * Set a nested property value an object.
 * Original source concepts from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/objects/dotSet.ts Sí, funciona}
 * @param {Object} arrayObject - The array or object to set the property on
 * @param {string} dotNotation - The path for the property
 * @param {*} value - The default value to return if the property is not found
 * @returns {Object} The modified object
 * @private
 */
export const dotSet = (arrayObject, dotNotation, value = null) => {
  let key = strBefore(dotNotation, '.')
  const lastKey = !key
  if (lastKey) {
    key = dotNotation
  }
  if (key === '*') {
    for (const wildKey in arrayObject) {
      if (lastKey) {
        arrayObject[wildKey] = value
        continue
      }
      if (!isObject(arrayObject[wildKey])) {
        continue
      }
      dotSet(arrayObject[wildKey], strAfter(dotNotation, '.'), value)
    }
    return arrayObject
  }
  if (lastKey) {
    arrayObject[dotNotation] = value
    return arrayObject
  }
  const rest = strAfter(dotNotation, '.')
  // A missing parent becomes an array only when the next key is an index (a.0), otherwise a plain object (a.b)
  const next = arrayObject[key] ?? (/^\d+$/.test(strBefore(rest, '.') || rest) ? [] : {})
  arrayObject[key] = dotSet(next, rest, value)
  return arrayObject
}
