"use strict";

require("core-js/modules/esnext.weak-map.delete-all.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = void 0;
var _bundle = require("./bundle.js");
var _bundleMinify = require("./bundleMinify.js");
var _partials = require("./partials.js");
var _compileReadme = require("./compileReadme.js");
var _typeDocs = require("./typeDocs.js");
var _jsdocDocs = require("./jsdocDocs.js");
var _distMinify = require("./distMinify.js");
var _sourceLint = require("./sourceLint.js");
var _gulp = require("gulp");
var gulpConfig = _interopRequireWildcard(require("../gulp.config.js"));
var _copyFonts = require("./copyFonts.js");
var _images = require("./images.js");
var _resolveDocsMethod = require("./partials/resolveDocsMethod.js");
var _sass = require("./sass.js");
var _testFull = require("./testFull.js");
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
/**
 * Runs several processes to build and validate the project.
 * Cleans and lints the source, distributes and minifies, bundles and minifies, creates the readme, then runs the
 * tests.
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
const build = (done = null) => {
  const buildActions = [(0, _partials.distSeries)(), _distMinify.distMinify];
  const generateDocs = gulpConfig.get('docs.enabled');
  const docsMethod = (0, _resolveDocsMethod.resolveDocsMethod)();
  if (generateDocs) {
    // The documentation is generated from the source itself, the readme is written by hand. With docs.inBuild off,
    // generating it is left to the standalone docs task (gulp docs), so a build never rewrites it.
    if (gulpConfig.get('docs.inBuild') !== false) {
      buildActions.push(docsMethod === 'jsdoc' ? _jsdocDocs.jsdocDocs : _typeDocs.typeDocs);
    }
  } else if (gulpConfig.get('typescript.enabled')) {
    // For ts usage, we need to run the readme on the dist directly since that is where the .js files are located
    buildActions.push(_compileReadme.compileReadme);
  }
  if (gulpConfig.get('browser.enabled')) {
    // If not 'nodeOnly' then we also want to bundle for browser after we complete the dist directory
    buildActions.push(_bundle.bundle);
    buildActions.push(_bundleMinify.bundleMinify);
  }
  const runActions = [(0, _gulp.series)(...buildActions)];
  if (!generateDocs && !gulpConfig.get('typescript.enabled')) {
    // Since we didn't run this in series after dist because of typescript, we need to run it now. Potentially faster here.
    runActions.push(_compileReadme.compileReadme);
  }
  runActions.push(_testFull.testFull);
  if (gulpConfig.get('fonts.enabled')) {
    // Conditionally add Fonts process
    runActions.push(_copyFonts.copyFonts);
  }
  if (gulpConfig.get('images.enabled')) {
    // Conditionally add Images process
    runActions.push(_images.images);
  }
  if (gulpConfig.get('sass.enabled')) {
    // Conditionally add SASS process
    runActions.push(_sass.sass);
  }
  // clean has to finish before anything writes into the output folders - images, fonts and sass all write into
  // browser/, so running clean in parallel with them races (ENOTEMPTY errors from clean, or output deleted mid-write).
  // sourceLint fixes the real source in place before anything compiles from it (distSeries, tsFor inside it), so a
  // build never reads a mix of pre- and post-fix content; clean only touches dist/browser output, so the two can
  // run alongside each other.
  return (0, _gulp.series)((0, _gulp.parallel)(_partials.clean, _sourceLint.sourceLint), (0, _gulp.parallel)(...runActions))(done);
};
exports.build = build;