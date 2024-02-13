/**
 * Retrieve the string part before the search match.
 * Original source from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/strBefore.ts Sí, funciona}
 * @param {string} str
 * @param {string} search
 * @returns {string}
 */
const strBefore = (str, search) => {
  const index = str.indexOf(search)
  return index === -1 ? '' : str.slice(0, index)
}

module.exports = strBefore
