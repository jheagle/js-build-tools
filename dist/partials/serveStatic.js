"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serveStatic = void 0;
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodeHttp = _interopRequireDefault(require("node:http"));
var _nodePath = _interopRequireDefault(require("node:path"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
};

/**
 * Serve a directory's real files over plain HTTP, for anything that needs a page loaded from a real URL rather
 * than a bare file:// path - most commonly, a page using root-relative asset paths (/browser/...), which a
 * file:// load resolves against the filesystem root instead of the page's own directory.
 * @memberOf module:partials
 * @param {string} rootDir - The directory to serve.
 * @param {number} [port=0] - The port to listen on; 0 picks any free port.
 * @returns {Promise<{server: http.Server, url: string}>} The running server, and its base URL - close the
 * server yourself (server.close()) once done with it.
 */
const serveStatic = (rootDir, port = 0) => new Promise((resolve, reject) => {
  const server = _nodeHttp.default.createServer((req, res) => {
    const filePath = _nodePath.default.join(rootDir, decodeURIComponent(req.url.split('?')[0]));
    _nodeFs.default.readFile(filePath, (error, data) => {
      if (error) {
        res.statusCode = 404;
        return res.end(`Not found: ${req.url}`);
      }
      res.setHeader('Content-Type', contentTypes[_nodePath.default.extname(filePath)] || 'application/octet-stream');
      res.end(data);
    });
  });
  server.once('error', reject);
  server.listen(port, '127.0.0.1', () => resolve({
    server,
    url: `http://127.0.0.1:${server.address().port}`
  }));
});
exports.serveStatic = serveStatic;