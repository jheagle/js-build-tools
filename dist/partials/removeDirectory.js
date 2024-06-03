"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeDirectory = void 0;
var _fs = require("fs");
/**
 * Return a promise to be completed once the specified directory is deleted.
 * @memberOf module:partials
 * @param {string} dirPath
 * @returns {Promise<*>}
 */
const removeDirectory = dirPath => new Promise((resolve, reject) => (0, _fs.exists)(dirPath, doesExist => doesExist ? (0, _fs.rm)(dirPath, {
  recursive: true
}, error => error ? reject(error) : resolve(dirPath)) : resolve(dirPath)));
exports.removeDirectory = removeDirectory;