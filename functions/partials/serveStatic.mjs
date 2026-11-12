import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'

// A real, previously-undiscovered bug fixed here: without a Content-Type header, a browser enforces strict MIME
// checking on <script type="module"> and refuses to load it at all - exactly the case this partial exists for.
const contentTypes = {
  '.css': 'text/css',
  '.gif': 'image/gif',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.mjs': 'text/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
}

/**
 * Serve a directory's real files over plain HTTP, for anything that needs a page loaded from a real URL rather
 * than a bare file:// path - most commonly, a page using root-relative asset paths (/browser/...), which a
 * file:// load resolves against the filesystem root instead of the page's own directory.
 * A directory's own path (`/`, `/docs/`) serves its `index.html`, and nothing outside rootDir is ever served (403,
 * also through a symbolic link); a malformed URL gets 400.
 * @memberOf module:partials
 * @param {string} rootDir - The directory to serve.
 * @param {number} [port=0] - The port to listen on; 0 picks any free port.
 * @returns {Promise<{server: http.Server, url: string}>} The running server, and its base URL - close the
 * server yourself (server.close()) once done with it.
 */
export const serveStatic = (rootDir, port = 0) => new Promise((resolve, reject) => {
  const root = path.resolve(rootDir)
  // Where the directory really is (it may itself be a symbolic link); a missing one still starts, every request 404s
  let realRoot = root
  try {
    realRoot = fs.realpathSync(root)
  } catch {}
  const inside = (base, file) => file === base || file.startsWith(base + path.sep)
  const server = http.createServer((req, res) => {
    let filePath
    try {
      filePath = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0]))
    } catch {
      // A malformed URL (/%) can't be decoded: answer it rather than letting the error stop the server
      res.statusCode = 400
      return res.end(`Bad request: ${req.url}`)
    }
    // Only files inside the served directory: a path like /../../x would otherwise read anything on the machine. A
    // symbolic link inside it that points outside it doesn't count as inside.
    let realPath = filePath
    try {
      realPath = fs.realpathSync(filePath)
    } catch {}
    if (filePath.includes('\0') || !inside(root, filePath) || !inside(realRoot, realPath)) {
      res.statusCode = filePath.includes('\0') ? 400 : 403
      return res.end(`Not served: ${req.url}`)
    }
    // A directory (/, /docs/) serves its index.html, as a web server would
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html')
    }
    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.statusCode = 404
        return res.end(`Not found: ${req.url}`)
      }
      res.setHeader('Content-Type', contentTypes[path.extname(filePath)] || 'application/octet-stream')
      res.end(data)
    })
  })
  server.once('error', reject)
  server.listen(port, '127.0.0.1', () => resolve({ server, url: `http://127.0.0.1:${server.address().port}` }))
})
