"use strict";

require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.promise.js");
var _require = require('fs'),
  rm = _require.rm,
  exists = _require.exists;

/**
 * Return a promise to be completed once the specified directory is deleted.
 * @function
 * @memberOf module:partials
 * @param {string} dirPath
 * @returns {Promise<*>}
 */
var removeDirectory = function removeDirectory(dirPath) {
  return new Promise(function (resolve, reject) {
    return exists(dirPath, function (doesExist) {
      return doesExist ? rm(dirPath, {
        recursive: true
      }, function (error) {
        return error ? reject(error) : resolve(dirPath);
      }) : resolve(dirPath);
    });
  });
};
module.exports = removeDirectory;