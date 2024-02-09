const imagesFor = require('./partials/imagesFor.js')

/**
 * Move and optimize the images into the browser folder using configured settings.
 * @memberOf module:js-build-tools
 * @return {stream.Stream}
 */
const images = () => imagesFor()

module.exports = images
