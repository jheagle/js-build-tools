import { esmNamedExportsToCjs } from './esmNamedExportsToCjs.mjs'

describe('esmNamedExportsToCjs', () => {
  test('rewrites a single export const to a plain declaration plus a trailing module.exports', () => {
    const source = 'export const get = (path) => path\n'
    const result = esmNamedExportsToCjs(source)
    expect(result).toContain('const get = (path) => path')
    expect(result).toContain('module.exports = { get }')
    expect(result).not.toContain('export const')
  })

  test('rewrites multiple export const declarations into one module.exports with all the names', () => {
    const source = 'export const get = () => {}\nexport const set = () => {}\n'
    const result = esmNamedExportsToCjs(source)
    expect(result).toContain('const get = () => {}')
    expect(result).toContain('const set = () => {}')
    expect(result).toContain('module.exports = { get, set }')
  })

  test('rewrites export function and export class the same way', () => {
    const source = 'export function doThing() {}\nexport class Thing {}\n'
    const result = esmNamedExportsToCjs(source)
    expect(result).toContain('function doThing() {}')
    expect(result).toContain('class Thing {}')
    expect(result).toContain('module.exports = { doThing, Thing }')
  })

  test('leaves non-export lines and JSDoc comments untouched', () => {
    const source = '/**\n * A function.\n * @memberOf module:gulpConfig\n */\nexport const get = () => {}\n'
    const result = esmNamedExportsToCjs(source)
    expect(result).toContain('/**\n * A function.\n * @memberOf module:gulpConfig\n */\nconst get = () => {}')
  })

  test('does not add a module.exports block when there is nothing to export', () => {
    const source = 'import { thing } from \'./thing.mjs\'\nconst local = 1\n'
    const result = esmNamedExportsToCjs(source)
    expect(result).toBe(source)
    expect(result).not.toContain('module.exports')
  })

  test('leaves export default and other export forms untouched', () => {
    const source = 'const value = 1\nexport default value\n'
    const result = esmNamedExportsToCjs(source)
    expect(result).toContain('export default value')
    expect(result).not.toContain('module.exports')
  })
})
