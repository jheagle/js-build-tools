import fs from 'fs'
import path from 'node:path'
import * as setUp from '../test-helpers/setUp.mjs'
import { serveStatic } from './serveStatic.mjs'

setUp.setDefaults('test-serve-static')
const gulpConfig = setUp.gulpConfig

const write = (file, contents) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, contents)
}

beforeEach(
  () => setUp.beforeEach().then(() => {
    const srcPath = gulpConfig.get('srcPath')
    write(`${srcPath}/index.html`, '<!doctype html><html><body>hello</body></html>')
    write(`${srcPath}/sub/page.html`, '<!doctype html><html><body>nested</body></html>')
    write(`${srcPath}/module.js`, 'export default 1')
  })
)

afterEach(setUp.afterEach)

describe('serveStatic', () => {
  test('serves real files from the given directory over a real local HTTP server', async () => {
    const { server, url } = await serveStatic(gulpConfig.get('srcPath'))
    try {
      expect(url).toMatch(/^http:\/\/127\.0\.0\.1:\d+$/)
      const root = await fetch(`${url}/index.html`)
      expect(await root.text()).toBe('<!doctype html><html><body>hello</body></html>')
      const nested = await fetch(`${url}/sub/page.html`)
      expect(await nested.text()).toBe('<!doctype html><html><body>nested</body></html>')
    } finally {
      server.close()
    }
  })

  test('sends a real Content-Type, not a blank one - a browser refuses to load a <script type="module"> without one', async () => {
    const { server, url } = await serveStatic(gulpConfig.get('srcPath'))
    try {
      const html = await fetch(`${url}/index.html`)
      expect(html.headers.get('content-type')).toBe('text/html')
      const script = await fetch(`${url}/module.js`)
      expect(script.headers.get('content-type')).toBe('text/javascript')
    } finally {
      server.close()
    }
  })

  test('responds 404 for a file that does not exist, rather than hanging or throwing', async () => {
    const { server, url } = await serveStatic(gulpConfig.get('srcPath'))
    try {
      const response = await fetch(`${url}/nothing-here.html`)
      expect(response.status).toBe(404)
    } finally {
      server.close()
    }
  })

  test('two servers for the same directory each get their own free port', async () => {
    const first = await serveStatic(gulpConfig.get('srcPath'))
    const second = await serveStatic(gulpConfig.get('srcPath'))
    try {
      expect(first.url).not.toBe(second.url)
    } finally {
      first.server.close()
      second.server.close()
    }
  })
})
