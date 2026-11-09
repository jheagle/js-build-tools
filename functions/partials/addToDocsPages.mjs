import fs from 'node:fs'
import path from 'node:path'
import * as gulpConfig from '../../gulp.config.mjs'

// Every .html file below dirPath, at any depth
const listPages = dirPath => fs.readdirSync(dirPath, { withFileTypes: true })
  .flatMap(entry => {
    const entryPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      return listPages(entryPath)
    }
    return entry.isFile() && /\.html?$/i.test(entry.name) ? [entryPath] : []
  })

// html with the snippet put just before the last closing tag of that name, or unchanged when it has none
const insertBefore = (html, tag, snippet) => {
  const at = html.toLowerCase().lastIndexOf(`</${tag}>`)
  return at === -1 ? html : `${html.slice(0, at)}${snippet}\n${html.slice(at)}`
}

/**
 * Add the HTML of docs.headHtml and docs.bodyHtml to every page of the generated documentation: the first just before
 * `</head>`, the second just before `</body>`, for example an analytics script the rest of the site has. Both engines
 * (TypeDoc and jsdoc) run it after generating, so a setting works the same with either. A setting left false adds
 * nothing, and a page without the tag is left as it is.
 * @memberOf module:partials
 * @param {string} [outPath=gulpConfig.get('docs.to')] - The directory the documentation was generated into.
 * @param {string|false} [headHtml=gulpConfig.get('docs.headHtml')] - The HTML to add before `</head>`.
 * @param {string|false} [bodyHtml=gulpConfig.get('docs.bodyHtml')] - The HTML to add before `</body>`.
 * @returns {number} How many pages were changed.
 */
export const addToDocsPages = (
  outPath = gulpConfig.get('docs.to'),
  headHtml = gulpConfig.get('docs.headHtml'),
  bodyHtml = gulpConfig.get('docs.bodyHtml')
) => {
  if ((!headHtml && !bodyHtml) || !fs.existsSync(outPath)) {
    return 0
  }
  return listPages(outPath).reduce((changed, page) => {
    const html = fs.readFileSync(page, 'utf8')
    let updated = headHtml ? insertBefore(html, 'head', headHtml) : html
    updated = bodyHtml ? insertBefore(updated, 'body', bodyHtml) : updated
    if (updated === html) {
      return changed
    }
    fs.writeFileSync(page, updated)
    return changed + 1
  }, 0)
}
