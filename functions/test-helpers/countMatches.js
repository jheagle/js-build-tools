/**
 * Simple way to count string occurrences for testing.
 * @function
 * @memberOf module:testHelpers
 * @param {string} content
 * @param {string} search
 * @returns {number}
 */
const countMatches = (content, search) => content.split(search).length - 1

module.exports =  countMatches
