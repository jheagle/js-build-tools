"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "afterEach", {
  enumerable: true,
  get: function () {
    return _testFilesystem.afterEach;
  }
});
Object.defineProperty(exports, "beforeEach", {
  enumerable: true,
  get: function () {
    return _testFilesystem.beforeEach;
  }
});
Object.defineProperty(exports, "countMatches", {
  enumerable: true,
  get: function () {
    return _testFilesystem.countMatches;
  }
});
Object.defineProperty(exports, "createTempDir", {
  enumerable: true,
  get: function () {
    return _testFilesystem.createTempDir;
  }
});
Object.defineProperty(exports, "fileExists", {
  enumerable: true,
  get: function () {
    return _testFilesystem.fileExists;
  }
});
exports.gulpConfig = void 0;
Object.defineProperty(exports, "logObject", {
  enumerable: true,
  get: function () {
    return _testFilesystem.logObject;
  }
});
Object.defineProperty(exports, "removeDirectory", {
  enumerable: true,
  get: function () {
    return _testFilesystem.removeDirectory;
  }
});
exports.setDefaults = void 0;
var gulpConfig = _interopRequireWildcard(require("../../gulp.config.js"));
exports.gulpConfig = gulpConfig;
var _testFilesystem = require("test-filesystem");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// Import the configurations and override some of them to direct to the temp directory.

let tempDir = 'test-temp/';
let srcPath = `${tempDir}src`;

/**
 * Update the gulp configurations with the test data. Set the test directory where temp files will be created for testing.
 * @memberOf module:testHelpers
 * @param {string} testDir
 */
const setDefaults = function () {
  let testDir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'test-temp';
  tempDir = `${testDir}/`;
  srcPath = `${tempDir}src`;
  _testFilesystem.setUp.setDefaults(tempDir);
  const distPath = `${tempDir}dist`;
  const browserPath = `${tempDir}browser`;
  const sassPath = `${tempDir}sass`;
  gulpConfig.set('browser.from', `${distPath}/**/*.js`);
  gulpConfig.set('browser.to', browserPath);
  gulpConfig.set('cleanPaths', [distPath, browserPath]);
  gulpConfig.set('dist.from', `${srcPath}/**/!(*.test).js`);
  gulpConfig.set('dist.main', `${distPath}/main`);
  gulpConfig.set('dist.to', distPath);
  gulpConfig.set('fonts.from', `${srcPath}/fonts/**/*`);
  gulpConfig.set('fonts.to', `${browserPath}/fonts`);
  gulpConfig.set('images.from', `${srcPath}/img/**/*.+(png|jpg|jpeg|gif|svg)`);
  gulpConfig.set('images.to', `${browserPath}/img`);
  gulpConfig.set('readme.template', `${tempDir}MAIN.md`);
  gulpConfig.set('readme.to', tempDir);
  gulpConfig.set('readme.from', `${srcPath}/**/!(*.test).js`);
  gulpConfig.set('rootPath', tempDir);
  gulpConfig.set('sass.from', `${sassPath}/**/*.+(scss|sass)`);
  gulpConfig.set('sass.path', sassPath);
  gulpConfig.set('sass.to', `${browserPath}/css`);
  gulpConfig.set('srcPath', srcPath);
  gulpConfig.set('typescript.from', `${srcPath}/**/*.ts`);
  gulpConfig.set('typescript.to', distPath);
  gulpConfig.set('test.watch', `${srcPath}/**/*.js`);
};
exports.setDefaults = setDefaults;