"use strict";

const fs = require('fs');
const del = require('del');
// Import the configurations and override some of them in order to direct to the temp directory.
const gulpConfig = require('../../gulp.config.js');
let tempDir = 'test-temp/';
let srcPath = "".concat(tempDir, "src");

/**
 * Update the gulp configurations with the test data. Set the test directory where temp files will be created for testing.
 * @function
 * @memberOf module:testHelpers
 * @param {string} testDir
 */
const setDefaults = function () {
  let testDir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'test-temp';
  tempDir = "".concat(testDir, "/");
  srcPath = "".concat(tempDir, "src");
  gulpConfig.set('browserPath', "".concat(tempDir, "browser"));
  gulpConfig.set('distMain', "".concat(tempDir, "dist/main"));
  gulpConfig.set('distPath', "".concat(tempDir, "dist"));
  gulpConfig.set('distSearch', "".concat(tempDir, "dist/**/*.js"));
  gulpConfig.set('readmeTemplate', "".concat(tempDir, "MAIN.md"));
  gulpConfig.set('readmePath', tempDir);
  gulpConfig.set('rootPath', tempDir);
  gulpConfig.set('srcPath', srcPath);
  gulpConfig.set('srcSearch', "".concat(tempDir, "src/**/!(*.test).js"));
  gulpConfig.set('tsSearch', "".concat(tempDir, "src/**/*.ts"));
  gulpConfig.set('watchSearch', "".concat(tempDir, "src/**/*.js"));
};
exports.setDefaults = setDefaults;
exports.gulpConfig = gulpConfig;

/**
 * Ensure that the del has completed, recursively attempt to delete and recreate
 * @function
 * @memberOf module:testHelpers
 * @param {boolean} [exists=true]
 * @returns {Promise<*|void>}
 */
const createTempDir = async function () {
  let exists = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  if (exists) {
    return del(tempDir).then(() => createTempDir(fs.existsSync(tempDir)));
  }
  await fs.mkdirSync(tempDir);
  return fs.mkdirSync(srcPath);
};
exports.createTempDir = createTempDir;

/**
 * In the Jest.beforeEach function call this one to set up the temp directory.
 * @function
 * @memberOf module:testHelpers
 * @returns {Promise<*|void>}
 */
exports.beforeEach = () => createTempDir();

/**
 * In the Jest.afterEach function call this one to clean up and remove the temp directory.
 * @function
 * @memberOf module:testHelpers
 * @returns {Promise<*>}
 */
exports.afterEach = async () => await del(tempDir);