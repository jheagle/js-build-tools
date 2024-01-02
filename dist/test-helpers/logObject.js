"use strict";

/**
 * Log out an object in a nicely formatted way.
 * @function
 * @memberOf module:testHelpers
 * @param {Object} object
 * @param {string} [label=logging]
 * @param {string} [outputType=log]
 * @returns {string|undefined}
 */
const logObject = function (object) {
  let label = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'logging';
  let outputType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'log';
  const logger = outputType === 'string' ? (label, object) => `'${label}' | ` + JSON.stringify(object) : console[outputType];
  if (typeof require === 'undefined' || outputType === 'string') {
    return logger(label, object);
  }
  return logger(label, require('util').inspect(object, false, null, true));
};
module.exports = logObject;