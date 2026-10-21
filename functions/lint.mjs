import { lintSource } from './partials/lintSource.mjs'

/**
 * The standalone lint command (`gulp lint`, or `npm run lint`): the same linting and fixing as sourceLint, but it
 * fails (exits non-zero) when any errors remain that neostandard could not fix automatically.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
export const lint = () => lintSource({ failOnError: true })
