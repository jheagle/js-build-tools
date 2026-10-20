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
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
// Import the configurations and override some of them to direct to the temp directory.

let tempDir = 'test-temp/';
let srcPath = `${tempDir}src`;

/**
 * Update the gulp configurations with the test data. Set the test directory where temp files will be created for testing.
 * @memberOf module:testHelpers
 * @param {string} testDir
 */
const setDefaults = (testDir = 'test-temp') => {
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
  // Reset explicitly, for the same reason as readme.fromEsm below: this project's own build-tools.config.json turns
  // docs on and points them at the website checkout, which would leak into every test that never sets these itself.
  gulpConfig.set('docs.enabled', false);
  gulpConfig.set('docs.from', srcPath);
  gulpConfig.set('docs.to', `${tempDir}docs`);
  gulpConfig.set('docs.title', '');
  gulpConfig.set('fonts.from', `${srcPath}/fonts/**/*`);
  gulpConfig.set('fonts.to', `${browserPath}/fonts`);
  gulpConfig.set('images.from', `${srcPath}/img/**/*.+(png|jpg|jpeg|gif|svg)`);
  gulpConfig.set('images.to', `${browserPath}/img`);
  gulpConfig.set('readme.template', `${tempDir}MAIN.md`);
  gulpConfig.set('readme.to', tempDir);
  gulpConfig.set('readme.from', `${srcPath}/**/!(*.test).js`);
  // Reset explicitly: gulpConfig is a process-wide singleton seeded once from this real project's own
  // build-tools.config.json, so without this, this project's own real readme.fromEsm value (gulp.config.mjs)
  // would leak into every test that exercises addToReadme/compileReadme but never sets this path itself -
  // doing real file I/O and a real jsdoc-to-markdown parse of this project's own, much larger, config file.
  gulpConfig.set('readme.fromEsm', []);
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