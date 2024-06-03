import { isObject } from './isObject.mjs'

/**
 * Convert an array of keys into a regex, return a function to test if incoming keys match.
 * @param {Array.<string>} [retainObjects=[]] - An array of keys to retain as objects
 * @returns {Function} The dot-notated array
 */
const handleRetainObjects = (retainObjects = []) => {
  if (!retainObjects.length) {
    /**
     * Bypass the test function if there are no retainObjects.
     * @returns {false}
     */
    return (currentKey, value, results) => false
  }
  retainObjects = retainObjects.map(key => key.replace('\.', '\\.'))
  const retainRegex = new RegExp(`(${retainObjects.join('|')})$`)
  /**
   * Test if a key should be retained as an object.
   * @param {string} currentKey - The key to test
   * @param {*} value - The value of the key
   * @param {Object} results - The result object to add to
   * @returns {boolean}
   */
  return (currentKey, value, results) => {
    if (!currentKey.match(retainRegex)) {
      return false
    }
    results[currentKey] = value
    return true
  }
}

/**
 * The underlying logic function for converting arrays to dot-notation.
 * @param {Object} arrayObject - The array or object to dot-notate
 * @param {Function} didRetain - The test function to see if a key should be retained
 * @param {string} [prepend=''] - The path for the property being processed
 * @param {Object<string, *>} [results={}] - The final notated object to return
 * @returns {Object<string, *>} The dot-notated object
 */
const performDotNotate = (arrayObject, didRetain, prepend = '', results = {}) => {
  for (let key in arrayObject) {
    const value = arrayObject[key]
    const currentKey = `${prepend}${key}`
    if (didRetain(currentKey, value, results)) {
      continue
    }
    if (isObject(value)) {
      performDotNotate(value, didRetain, `${currentKey}.`, results)
      continue
    }
    results[currentKey] = value
  }

  return results
}

/**
 * Convert an array or object to a single dimensional associative array with dot notation.
 * Original source concepts from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/objects/dotNotate.ts Sí, funciona}
 * @param {Object} arrayObject - The array or object to dot-notate
 * @param {Array.<string>} [retainObjects=[]] - An array of keys to retain as objects
 * @returns {Object<string, *>} The dot-notated object
 */
export const dotNotate = (arrayObject, retainObjects = []) => performDotNotate(arrayObject, handleRetainObjects(retainObjects))
