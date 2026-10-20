/**
 * A jsdoc plugin for ES module source. When a file has no @module tag of its own, jsdoc names each
 * `export const x` it documents `exports.x`, so with `@memberOf module:name` it becomes `module:name.exports.x`
 * (shown as "exports.x"). This drops that `exports.` so it is `module:name.x`, the name it is used by.
 */
const prefix = 'exports.'

exports.handlers = {
  newDoclet ({ doclet }) {
    if (doclet.name && doclet.name.startsWith(prefix)) {
      doclet.name = doclet.name.slice(prefix.length)
    }
    if (doclet.longname && doclet.longname.includes(`.${prefix}`)) {
      doclet.longname = doclet.longname.replace(`.${prefix}`, '.')
    }
  }
}
