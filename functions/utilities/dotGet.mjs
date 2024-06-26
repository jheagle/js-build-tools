import { isObject } from './isObject.mjs'
import { strAfter } from './strAfter.mjs'
import { strBefore } from './strBefore.mjs'

/**
 * Get a nested property value from an object.
 * Original source concepts from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/objects/dotGet.ts Sí, funciona}
 * @param {Object} [arrayObject={}] - The array or object to get the property from
 * @param {string} [dotNotation=''] - The path to the property
 * @param {string|null} [defaultValue=null] - The default value to return if the property is not found
 * @returns {*} The value of the property
 */
export const dotGet = (arrayObject = {}, dotNotation= '', defaultValue = null) => {
  if (!dotNotation) {
    return arrayObject
  }
  let key = strBefore(dotNotation, '.')
  const lastKey = !key
  if (lastKey) {
    key = dotNotation
  }
  if (key === '*') {
    const result = []
    for (let wildKey in arrayObject) {
      const wildValue = arrayObject[wildKey]
      if (lastKey) {
        result[wildKey] = wildValue
        continue
      }
      if (!isObject(wildValue)) {
        continue
      }
      result[wildKey] = dotGet(wildValue, strAfter(dotNotation, '.'), defaultValue)
    }
    return result
  }
  if (lastKey) {
    return arrayObject[dotNotation] ?? defaultValue
  }
  if (typeof arrayObject[key] === 'undefined') {
    return defaultValue
  }
  const next = arrayObject[key]
  if (!isObject(next)) {
    return defaultValue
  }
  return dotGet(next, strAfter(dotNotation, '.'), defaultValue)
}
