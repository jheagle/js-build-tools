"use strict";

require("core-js/modules/es.json.stringify.js");
/**
 * Log out an object in a nicely formatted way.
 * @function
 * @memberOf module:testHelpers
 * @param {Object} object
 * @param {string} [label=logging]
 * @param {string} [outputType=log]
 * @returns {string|undefined}
 */
var logObject = function logObject(object) {
  var label = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'logging';
  var outputType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'log';
  var logger = outputType === 'string' ? function (label, object) {
    return "'".concat(label, "' | ") + JSON.stringify(object);
  } : console[outputType];
  if (typeof require === 'undefined' || outputType === 'string') {
    return logger(label, object);
  }
  return logger(label, require('util').inspect(object, false, null, true));
};
module.exports = logObject;