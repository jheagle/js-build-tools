import { requirePeer } from './loadPeer.mjs'

const installHint = 'Install it in your project with: npm install --save-dev playwright'

/**
 * Find Playwright (headless-browser automation) of the project being built, an optional peer dependency only
 * needed by whatever actually drives a real browser - projects which never do never need it installed.
 * @memberOf module:partials
 * @param {string} [projectPath=process.cwd()] The folder of the project (which has the package.json) being built.
 * @returns {Object} The Playwright module.
 * @throws {Error} With install instructions when playwright is not installed.
 */
export const loadPlaywright = (projectPath = process.cwd()) => requirePeer('playwright', { task: 'browser automation', installHint, projectPath })

/**
 * Launch a real headless Chromium browser via Playwright. See {@link loadPlaywright}.
 * @memberOf module:partials
 * @param {Function} [load=loadPlaywright] Which Playwright to launch - swappable in tests.
 * @param {string} [projectPath=process.cwd()] The folder of the project (which has the package.json) being built.
 * @returns {Promise<import('playwright').Browser>} The running browser - close it yourself (browser.close()) once done with it.
 * @throws {Error} With install instructions when playwright is not installed.
 */
export const launchBrowser = (load = loadPlaywright, projectPath = process.cwd()) => load(projectPath).chromium.launch()
