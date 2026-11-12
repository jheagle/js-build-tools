import fs from 'fs'
import http from 'node:http'
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

  test('a directory serves its index.html', async () => {
    const { server, url } = await serveStatic(gulpConfig.get('srcPath'))
    try {
      expect(await (await fetch(`${url}/`)).text()).toBe('<!doctype html><html><body>hello</body></html>')
      write(`${gulpConfig.get('srcPath')}/sub/index.html`, 'sub index')
      expect(await (await fetch(`${url}/sub/`)).text()).toBe('sub index')
    } finally {
      server.close()
    }
  })

  // fetch() normalises "..", so the request goes out raw, as any client could send it
  const rawStatus = (url, requestPath) => new Promise((resolve, reject) => {
    const { hostname, port } = new URL(url)
    http.get({ hostname, port, path: requestPath }, response => {
      response.resume()
      resolve(response.statusCode)
    }).on('error', reject)
  })

  test.each([
    ['..', '/../serve-static-outside.txt'],
    ['an encoded ..', '/%2e%2e/serve-static-outside.txt'],
    ['a deeper ..', '/sub/../../serve-static-outside.txt'],
  ])('nothing outside the served directory is served (%s)', async (description, requestPath) => {
    const srcPath = gulpConfig.get('srcPath')
    write(path.join(srcPath, '..', 'serve-static-outside.txt'), 'secret')
    const { server, url } = await serveStatic(srcPath)
    try {
      expect(await rawStatus(url, requestPath)).toBe(403)
      expect(await rawStatus(url, '/sub/../index.html')).toBe(200)
    } finally {
      server.close()
      fs.rmSync(path.join(srcPath, '..', 'serve-static-outside.txt'), { force: true })
    }
  })

  test.each([['/%'], ['/%00'], ['/index.html%00.js']])('a malformed URL (%s) gets 400, and the server keeps serving', async requestPath => {
    const { server, url } = await serveStatic(gulpConfig.get('srcPath'))
    try {
      expect(await rawStatus(url, requestPath)).toBe(400)
      expect(await rawStatus(url, '/index.html')).toBe(200)
    } finally {
      server.close()
    }
  })

  test('a symbolic link inside the served directory that points outside it is not followed', async () => {
    const srcPath = gulpConfig.get('srcPath')
    const outside = path.resolve(srcPath, '..', 'serve-static-linked')
    write(path.join(outside, 'secret.txt'), 'secret')
    fs.symlinkSync(outside, path.join(srcPath, 'linked'))
    const { server, url } = await serveStatic(srcPath)
    try {
      expect(await rawStatus(url, '/linked/secret.txt')).toBe(403)
    } finally {
      server.close()
      fs.rmSync(outside, { recursive: true, force: true })
    }
  })

  test('a directory that does not exist still starts, and answers 404', async () => {
    const { server, url } = await serveStatic(path.join(gulpConfig.get('srcPath'), 'no-such-dir'))
    try {
      expect(await rawStatus(url, '/index.html')).toBe(404)
    } finally {
      server.close()
    }
  })
})
