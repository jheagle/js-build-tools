import * as gulpConfig from '../../gulp.config.mjs'

/**
 * Pick which engine generates the HTML documentation: docs.method picks it explicitly; left unset (false, the
 * default), it's inferred from typescript.enabled - every existing TypeScript project's config, which never
 * sets method, keeps producing TypeDoc output exactly as it always has.
 * @memberOf module:partials
 * @returns {'typedoc'|'jsdoc'}
 */
export const resolveDocsMethod = () => gulpConfig.get('docs.method') || (gulpConfig.get('typescript.enabled') ? 'typedoc' : 'jsdoc')
