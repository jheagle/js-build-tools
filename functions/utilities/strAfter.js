/**
 * Retrieve the string part after the search match.
 * Original source from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/strAfter.ts Sí, funciona}
 * @param {string} str
 * @param {string} search
 * @returns {string}
 */
const strAfter = (str, search) => {
  const index = str.indexOf(search)
  return index === -1 ? '' : str.substring(index + search.length)
}

module.exports = strAfter
