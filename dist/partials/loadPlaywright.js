"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadPlaywright = exports.launchBrowser = void 0;
var _loadPeer = require("./loadPeer.js");
const installHint = 'Install it in your project with: npm install --save-dev playwright';

/**
 * Find Playwright (headless-browser automation) of the project being built, an optional peer dependency only
 * needed by whatever actually drives a real browser - projects which never do never need it installed.
 * @memberOf module:partials
 * @param {string} [projectPath=process.cwd()] The folder of the project (which has the package.json) being built.
 * @returns {Object} The Playwright module.
 * @throws {Error} With install instructions when playwright is not installed.
 */
const loadPlaywright = (projectPath = process.cwd()) => (0, _loadPeer.requirePeer)('playwright', {
  task: 'browser automation',
  installHint,
  projectPath
});

/**
 * Launch a real headless Chromium browser via Playwright. See {@link loadPlaywright}.
 * @memberOf module:partials
 * @param {Function} [load=loadPlaywright] Which Playwright to launch - swappable in tests.
 * @param {string} [projectPath=process.cwd()] The folder of the project (which has the package.json) being built.
 * @returns {Promise<Browser>} The running Playwright browser - close it yourself (browser.close()) once done with it.
 * @throws {Error} With install instructions when playwright is not installed.
 */
exports.loadPlaywright = loadPlaywright;
const launchBrowser = (load = loadPlaywright, projectPath = process.cwd()) => load(projectPath).chromium.launch();
exports.launchBrowser = launchBrowser;