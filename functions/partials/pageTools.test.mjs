import { jest } from '@jest/globals'
import fs from 'fs'
import path from 'node:path'
import * as setUp from '../test-helpers/setUp.mjs'
import { serveStatic } from './serveStatic.mjs'
import { launchBrowser } from './loadPlaywright.mjs'
import { clickLabel, trackMutations, watchPage } from './pageTools.mjs'

// A real headless Chromium against real pages served by serveStatic (needs `npx playwright install chromium`)
jest.setTimeout(30000)

setUp.setDefaults('test-page-tools')
const gulpConfig = setUp.gulpConfig

const write = (file, contents) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, contents)
}

const page = html => `<!doctype html><html><head><meta charset="utf-8"></head><body>${html}</body></html>`

let browser
let served
let tab

beforeAll(async () => {
  browser = await launchBrowser()
})

afterAll(() => browser.close())

beforeEach(
  () => setUp.beforeEach().then(async () => {
    const srcPath = gulpConfig.get('srcPath')
    write(`${srcPath}/errors.html`, page(`
      <script>
        console.error('a console error')
        fetch('/missing.json')
        setTimeout(() => { throw new Error('an uncaught error') }, 0)
      </script>`))
    write(`${srcPath}/controls.html`, page(`
      <button onclick="window.clicked = 'start'">Start</button>
      <button onclick="window.clicked = 'start game'">Start Game</button>
      <input type="button" value="Ready" onclick="window.clicked = 'ready'">
      <button style="display: none" onclick="window.clicked = 'hidden'">Hidden</button>
      <button onclick="window.clicked = 'contains'">Play Again Now</button>`))
    write(`${srcPath}/changes.html`, page('<div id="target"></div>'))
    served = await serveStatic(srcPath)
    tab = await browser.newPage()
  })
)

afterEach(async () => {
  await tab.close()
  served.server.close()
  return setUp.afterEach()
})

describe('watchPage', () => {
  test('collects uncaught errors, console errors and HTTP error responses', async () => {
    const problems = watchPage(tab)
    await tab.goto(`${served.url}/errors.html`)
    await tab.waitForTimeout(300)
    expect(problems).toContain('console: a console error')
    expect(problems).toContain('pageerror: an uncaught error')
    expect(problems.some(problem => /^HTTP 404: .*\/missing\.json$/.test(problem))).toBe(true)
    // the browser's own message about the failed load says which resource it was
    expect(problems.some(problem => /^console: Failed to load resource.*\(.*\/missing\.json\)$/.test(problem))).toBe(true)
  })

  test('leaves out what matches an ignore pattern', async () => {
    const problems = watchPage(tab, { ignore: [/missing\.json/, /console error/] })
    await tab.goto(`${served.url}/errors.html`)
    await tab.waitForTimeout(300)
    expect(problems).toEqual(['pageerror: an uncaught error'])
  })
})

describe('clickLabel', () => {
  test.each([
    ['an exact label before one that only contains it', 'Start', 'start'],
    ['a longer exact label', 'Start Game', 'start game'],
    ['an input button by its value', 'Ready', 'ready'],
    ['otherwise the first label that contains it', 'Play Again', 'contains'],
  ])('clicks %s', async (description, label, expected) => {
    await tab.goto(`${served.url}/controls.html`)
    await clickLabel(tab, label)
    expect(await tab.evaluate(() => window.clicked)).toBe(expected)
  })

  test('inPage clicks the same controls, in one step inside the page', async () => {
    await tab.goto(`${served.url}/controls.html`)
    await clickLabel(tab, 'Start', { inPage: true })
    expect(await tab.evaluate(() => window.clicked)).toBe('start')
    await clickLabel(tab, 'Ready', { inPage: true })
    expect(await tab.evaluate(() => window.clicked)).toBe('ready')
  })

  test.each([[false], [true]])('a missing or hidden label fails at once, naming what is visible (inPage %s)', async inPage => {
    await tab.goto(`${served.url}/controls.html`)
    const started = Date.now()
    await expect(clickLabel(tab, 'Hidden', { inPage })).rejects.toThrow(
      'No visible control labelled "Hidden". Visible: "Start", "Start Game", "Ready", "Play Again Now"'
    )
    expect(Date.now() - started).toBeLessThan(5000)
  })
})

describe('trackMutations', () => {
  test('counts every element of an added or removed subtree, attribute writes and text changes', async () => {
    await tab.goto(`${served.url}/changes.html`)
    const mutations = await trackMutations(tab)
    await tab.evaluate(() => {
      const target = document.getElementById('target')
      const list = document.createElement('ul')
      list.innerHTML = '<li>one</li><li>two</li>'
      target.appendChild(list)
      target.setAttribute('class', 'changed')
      target.setAttribute('title', 'changed')
    })
    expect(await mutations.read()).toEqual({ added: 3, removed: 0, attributes: 2, text: 0 })
    await tab.evaluate(() => {
      document.querySelector('li').firstChild.nodeValue = 'uno'
      document.querySelector('ul').remove()
    })
    // read() starts the next count from zero
    expect(await mutations.read()).toEqual({ added: 0, removed: 3, attributes: 0, text: 1 })
    expect(await mutations.read()).toEqual({ added: 0, removed: 0, attributes: 0, text: 0 })
  })

  test('watches only inside the given element', async () => {
    await tab.goto(`${served.url}/changes.html`)
    const mutations = await trackMutations(tab, '#target')
    await tab.evaluate(() => {
      document.body.setAttribute('class', 'outside')
      document.getElementById('target').setAttribute('class', 'inside')
    })
    expect((await mutations.read()).attributes).toBe(1)
  })
})
