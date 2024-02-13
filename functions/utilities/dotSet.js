const isObject = require('./isObject')
const strAfter = require('./strAfter')
const strBefore = require('./strBefore')

/**
 * Set a nested property value an object.
 * Original source concepts from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/objects/dotSet.ts Sí, funciona}
 * @param {Object} arrayObject - The array or object to set the property on
 * @param {string} dotNotation - The path for the property
 * @param {*} value - The default value to return if the property is not found
 * @returns {Object} The modified object
 */
const dotSet = (arrayObject, dotNotation, value = null) => {
  let key = strBefore(dotNotation, '.')
  const lastKey = !key
  if (lastKey) {
    key = dotNotation
  }
  if (key === '*') {
    for (let wildKey in arrayObject) {
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
  const next = arrayObject[key] ?? []
  arrayObject[key] = dotSet(next, strAfter(dotNotation, '.'), value)
  return arrayObject
}

module.exports = dotSet
