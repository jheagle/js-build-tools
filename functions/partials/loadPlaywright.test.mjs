import fs from 'fs'
import path from 'node:path'
import * as setUp from '../test-helpers/setUp.mjs'
import { loadPlaywright, launchBrowser } from './loadPlaywright.mjs'
import { serveStatic } from './serveStatic.mjs'

setUp.setDefaults('test-load-playwright')
const gulpConfig = setUp.gulpConfig

beforeEach(setUp.beforeEach)
afterEach(setUp.afterEach)

describe('loadPlaywright', () => {
  test('explains how to install playwright when the project does not have it', () => {
    expect(() => loadPlaywright('/')).toThrow(/optional peer dependency playwright.*npm install --save-dev playwright/)
  })

  // Unlike typedoc (ESM-only, see typeDocsFor.test.mjs), playwright is CommonJS-compatible, so its real loading can
  // be tested directly here rather than only end to end.
  test('loads the real playwright module from this project (its own devDependency)', () => {
    const playwright = loadPlaywright()
    expect(typeof playwright.chromium.launch).toBe('function')
  })
})

describe('launchBrowser', () => {
  test('resolves playwright (via the given loader) and launches its chromium', async () => {
    const launch = jest.fn(() => Promise.resolve('a-real-browser'))
    const load = jest.fn(() => ({ chromium: { launch } }))
    await expect(launchBrowser(load, '/some/project')).resolves.toBe('a-real-browser')
    expect(load).toHaveBeenCalledWith('/some/project')
    expect(launch).toHaveBeenCalledTimes(1)
  })

  test('defaults to the real loadPlaywright and launches a real, working browser', async () => {
    const browser = await launchBrowser()
    expect(browser.isConnected()).toBe(true)
    await browser.close()
  }, 30000)
})

describe('a real page, served and loaded end to end', () => {
  // The exact real-world case that motivated this partial: a page using a root-relative asset path
  // (/style.css), which a bare file:// load resolves against the filesystem root instead of the page's own
  // directory - serveStatic + a real browser is what actually proves this resolves correctly, not jsdom
  // (which cannot execute <script type="module"> at all, the limitation this whole capability exists to close).
  test('a page with a root-relative asset path loads correctly through a real server and a real browser', async () => {
    const srcPath = gulpConfig.get('srcPath')
    fs.mkdirSync(`${srcPath}/browser`, { recursive: true })
    fs.writeFileSync(`${srcPath}/browser/style.css`, 'body { background-color: rgb(1, 2, 3); }')
    fs.writeFileSync(`${srcPath}/index.html`, [
      '<!doctype html><html><head>',
      '<link rel="stylesheet" href="/browser/style.css">',
      '<script type="module">document.title = \'loaded via a real module script\'</script>',
      '</head><body></body></html>'
    ].join(''))

    const { server, url } = await serveStatic(srcPath)
    const browser = await launchBrowser()
    try {
      const page = await browser.newPage()
      await page.goto(`${url}/index.html`)
      expect(await page.title()).toBe('loaded via a real module script')
      const backgroundColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
      expect(backgroundColor).toBe('rgb(1, 2, 3)')
    } finally {
      await browser.close()
      server.close()
    }
  }, 30000)
})
