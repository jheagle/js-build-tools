"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = plur;
require("core-js/modules/es.string.replace.js");
var _irregularPlurals = _interopRequireDefault(require("irregular-plurals"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function plur(word, plural, count) {
  if (typeof plural === 'number') {
    count = plural;
  }
  if (_irregularPlurals.default.has(word.toLowerCase())) {
    plural = _irregularPlurals.default.get(word.toLowerCase());
    const firstLetter = word.charAt(0);
    const isFirstLetterUpperCase = firstLetter === firstLetter.toUpperCase();
    if (isFirstLetterUpperCase) {
      plural = firstLetter + plural.slice(1);
    }
    const isWholeWordUpperCase = word === word.toUpperCase();
    if (isWholeWordUpperCase) {
      plural = plural.toUpperCase();
    }
  } else if (typeof plural !== 'string') {
    plural = (word.replace(/(?:s|x|z|ch|sh)$/i, '$&e').replace(/([^aeiou])y$/i, '$1ie') + 's').replace(/i?e?s$/i, match => {
      const isTailLowerCase = word.slice(-1) === word.slice(-1).toLowerCase();
      return isTailLowerCase ? match.toLowerCase() : match.toUpperCase();
    });
  }
  return Math.abs(count) === 1 ? word : plural;
}