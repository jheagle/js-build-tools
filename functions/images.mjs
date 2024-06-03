import { imagesFor } from './partials/imagesFor.mjs'

/**
 * Move and optimize the images into the browser folder using configured settings.
 * @memberOf module:js-build-tools
 * @return {stream.Stream}
 */
export const images = () => imagesFor()
