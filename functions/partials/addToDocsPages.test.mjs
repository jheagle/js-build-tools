import fs from 'fs'
import path from 'node:path'
import * as setUp from '../test-helpers/setUp.mjs'
import { addToDocsPages } from './addToDocsPages.mjs'

setUp.setDefaults('test-add-to-docs-pages')
const gulpConfig = setUp.gulpConfig

const outPath = () => `${gulpConfig.get('srcPath')}/../docs`
const write = (file, contents) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, contents)
}
const read = file => fs.readFileSync(`${outPath()}/${file}`, 'utf8')
const script = '<script data-goatcounter="https://example.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>'

beforeEach(() => setUp.beforeEach().then(() => {
  write(`${outPath()}/index.html`, '<html><head><title>Docs</title></head><body><p>Hello</p></body></html>')
  write(`${outPath()}/module/deep/page.HTML`, '<HTML><HEAD></HEAD><BODY></BODY></HTML>')
  write(`${outPath()}/assets/style.css`, 'body { color: red } </body>')
  write(`${outPath()}/fragment.html`, '<p>no tags</p>')
}))

afterEach(() => {
  gulpConfig.set('docs.bodyHtml', false)
  gulpConfig.set('docs.headHtml', false)
  return setUp.afterEach()
})

describe('addToDocsPages', () => {
  test('adds docs.bodyHtml before </body> and docs.headHtml before </head> of every page, at any depth', () => {
    gulpConfig.set('docs.bodyHtml', script)
    gulpConfig.set('docs.headHtml', '<meta name="x" content="y">')
    expect(addToDocsPages(outPath())).toBe(2)
    expect(read('index.html')).toBe(`<html><head><title>Docs</title><meta name="x" content="y">\n</head><body><p>Hello</p>${script}\n</body></html>`)
    expect(read('module/deep/page.HTML')).toBe(`<HTML><HEAD><meta name="x" content="y">\n</HEAD><BODY>${script}\n</BODY></HTML>`)
  })

  test('leaves files that are not pages, and pages without the tag, as they are', () => {
    gulpConfig.set('docs.bodyHtml', script)
    addToDocsPages(outPath())
    expect(read('assets/style.css')).toBe('body { color: red } </body>')
    expect(read('fragment.html')).toBe('<p>no tags</p>')
  })

  test('puts the snippet before the last </body>, so one inside an example in the page is not used', () => {
    write(`${outPath()}/index.html`, '<html><body><pre>&lt;/body&gt;</pre><script>"</body>"</script></body></html>')
    addToDocsPages(outPath(), false, script)
    expect(read('index.html')).toBe(`<html><body><pre>&lt;/body&gt;</pre><script>"</body>"</script>${script}\n</body></html>`)
  })

  test('adds only the one that is set', () => {
    addToDocsPages(outPath(), false, script)
    expect(read('index.html')).toBe(`<html><head><title>Docs</title></head><body><p>Hello</p>${script}\n</body></html>`)
  })

  test('changes nothing with both left false (the default), or when the directory does not exist', () => {
    expect(gulpConfig.get('docs.bodyHtml')).toBe(false)
    expect(gulpConfig.get('docs.headHtml')).toBe(false)
    expect(addToDocsPages(outPath())).toBe(0)
    expect(read('index.html')).toBe('<html><head><title>Docs</title></head><body><p>Hello</p></body></html>')
    expect(addToDocsPages(`${outPath()}/missing`, false, script)).toBe(0)
  })
})
