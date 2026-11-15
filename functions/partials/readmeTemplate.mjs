import fs from 'node:fs'
import path from 'node:path'
import { dest, src } from 'gulp'
import * as gulpConfig from '../../gulp.config.mjs'
import rename from 'gulp-rename'

/**
 * Copy a readme template into the README.md file. Without the template (readme.template names a file which does not
 * exist, or is empty), the readme starts empty instead, so it holds only the generated documentation. To keep a
 * hand-written readme instead, turn readme.enabled off (the default).
 * @memberOf module:partials
 * @returns {*}
 */
export const readmeTemplate = () => {
  const template = gulpConfig.get('readme.template')
  if (template && fs.existsSync(template)) {
    return src(template)
      .pipe(rename(gulpConfig.get('readme.file')))
      .pipe(dest(gulpConfig.get('readme.to')))
  }
  const readmePath = gulpConfig.get('readme.to') + gulpConfig.get('readme.file')
  console.warn(`readme.template (${template || 'not set'}) was not found: ${readmePath} holds only the generated documentation. Turn readme.enabled off (the default) to keep a hand-written readme.`)
  fs.mkdirSync(path.dirname(readmePath), { recursive: true })
  fs.writeFileSync(readmePath, '')
  return Promise.resolve()
}
