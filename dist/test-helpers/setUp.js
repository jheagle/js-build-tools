"use strict";

// Import the configurations and override some of them to direct to the temp directory.
const gulpConfig = require('../../gulp.config.js');
const {
  setUp
} = require('test-filesystem');
let tempDir = 'test-temp/';
let srcPath = "".concat(tempDir, "src");

/**
 * Update the gulp configurations with the test data. Set the test directory where temp files will be created for testing.
 * @memberOf module:testHelpers
 * @param {string} testDir
 */
const setDefaults = function () {
  let testDir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'test-temp';
  tempDir = "".concat(testDir, "/");
  srcPath = "".concat(tempDir, "src");
  setUp.setDefaults(tempDir);
  const distPath = "".concat(tempDir, "dist");
  const browserPath = "".concat(tempDir, "browser");
  const sassPath = "".concat(tempDir, "sass");
  gulpConfig.set('browserPath', browserPath);
  gulpConfig.set('cleanPaths', [distPath, browserPath]);
  gulpConfig.set('cssPath', "".concat(browserPath, "/css"));
  gulpConfig.set('distMain', "".concat(distPath, "/main"));
  gulpConfig.set('distPath', distPath);
  gulpConfig.set('distSearch', "".concat(distPath, "/**/*.js"));
  gulpConfig.set('fontDest', "".concat(browserPath, "/fonts"));
  gulpConfig.set('fontSearch', "".concat(srcPath, "/fonts/**/*"));
  gulpConfig.set('imageDest', "".concat(browserPath, "/img"));
  gulpConfig.set('imageSearch', "".concat(srcPath, "/img/**/*.+(png|jpg|jpeg|gif|svg)"));
  gulpConfig.set('readmeTemplate', "".concat(tempDir, "MAIN.md"));
  gulpConfig.set('readmePath', tempDir);
  gulpConfig.set('readmeSearch', "".concat(srcPath, "/**/!(*.test).js"));
  gulpConfig.set('rootPath', tempDir);
  gulpConfig.set('sassPath', sassPath);
  gulpConfig.set('sassSearch', "".concat(sassPath, "/**/*.+(scss|sass)"));
  gulpConfig.set('srcPath', srcPath);
  gulpConfig.set('srcSearch', "".concat(srcPath, "/**/!(*.test).js"));
  gulpConfig.set('tsSearch', "".concat(srcPath, "/**/*.ts"));
  gulpConfig.set('watchSearch', "".concat(srcPath, "/**/*.js"));
};
exports.setDefaults = setDefaults;
exports.gulpConfig = gulpConfig;

/**
 * Ensure that the del has completed, recursively attempt to delete and recreate
 * @memberOf module:testHelpers
 * @param {boolean} [exists=true]
 * @returns {Promise<*|void>}
 */
exports.createTempDir = setUp.createTempDir;

/**
 * In the Jest.beforeEach function call this one to set up the temp directory.
 * @memberOf module:testHelpers
 * @returns {Promise<*|void>}
 */
exports.beforeEach = setUp.beforeEach;

/**
 * In the Jest.afterEach function call this one to clean up and remove the temp directory.
 * @memberOf module:testHelpers
 * @returns {Promise<*>}
 */
exports.afterEach = setUp.afterEach;