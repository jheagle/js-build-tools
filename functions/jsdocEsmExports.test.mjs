import path from 'node:path'
import jsdocBase from '../jsdoc.base.js'
import { handlers } from '../jsdoc.esmExports.js'

describe('jsdoc.esmExports', () => {
  test('is one of the plugins in jsdoc.base', () => {
    expect(jsdocBase.plugins).toContain(path.resolve('jsdoc.esmExports.js'))
  })

  test('drops the exports. jsdoc gives a documented export of a file without its own @module tag', () => {
    const doclet = { name: 'exports.build', longname: 'module:js-build-tools.exports.build' }
    handlers.newDoclet({ doclet })
    expect(doclet).toEqual({ name: 'build', longname: 'module:js-build-tools.build' })
  })

  test('leaves every other name as it is', () => {
    const doclet = { name: 'build', longname: 'module:js-build-tools.build' }
    handlers.newDoclet({ doclet })
    expect(doclet).toEqual({ name: 'build', longname: 'module:js-build-tools.build' })
    const exportsless = { name: 'exportsThing', longname: 'exportsThing' }
    handlers.newDoclet({ doclet: exportsless })
    expect(exportsless).toEqual({ name: 'exportsThing', longname: 'exportsThing' })
  })
})
