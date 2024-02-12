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
  gulpConfig.set('browser.from', "".concat(distPath, "/**/*.js"));
  gulpConfig.set('browser.to', browserPath);
  gulpConfig.set('cleanPaths', [distPath, browserPath]);
  gulpConfig.set('dist.from', "".concat(srcPath, "/**/!(*.test).js"));
  gulpConfig.set('dist.main', "".concat(distPath, "/main"));
  gulpConfig.set('dist.to', distPath);
  gulpConfig.set('fonts.from', "".concat(srcPath, "/fonts/**/*"));
  gulpConfig.set('fonts.to', "".concat(browserPath, "/fonts"));
  gulpConfig.set('images.from', "".concat(srcPath, "/img/**/*.+(png|jpg|jpeg|gif|svg)"));
  gulpConfig.set('images.to', "".concat(browserPath, "/img"));
  gulpConfig.set('readme.template', "".concat(tempDir, "MAIN.md"));
  gulpConfig.set('readme.to', tempDir);
  gulpConfig.set('readme.from', "".concat(srcPath, "/**/!(*.test).js"));
  gulpConfig.set('rootPath', tempDir);
  gulpConfig.set('sass.from', "".concat(sassPath, "/**/*.+(scss|sass)"));
  gulpConfig.set('sass.path', sassPath);
  gulpConfig.set('sass.to', "".concat(browserPath, "/css"));
  gulpConfig.set('srcPath', srcPath);
  gulpConfig.set('typescript.from', "".concat(srcPath, "/**/*.ts"));
  gulpConfig.set('typescript.to', distPath);
  gulpConfig.set('test.watch', "".concat(srcPath, "/**/*.js"));
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