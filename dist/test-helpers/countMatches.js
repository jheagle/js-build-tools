"use strict";

require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.split.js");
/**
 * Simple way to count string occurrences for testing.
 * @function
 * @memberOf module:testHelpers
 * @param {string} content
 * @param {string} search
 * @returns {number}
 */
var countMatches = function countMatches(content, search) {
  return content.split(search).length - 1;
};
module.exports = countMatches;