'use strict';

const execa = require('execa');
const gifsicle = require('gifsicle');
const isGif = require('is-gif');
module.exports = function () {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return async input => {
    if (!Buffer.isBuffer(input)) {
      throw new TypeError("Expected `input` to be of type `Buffer` but received type `".concat(typeof input, "`"));
    }
    if (!isGif(input)) {
      return input;
    }
    const args = ['--no-warnings', '--no-app-extensions'];
    if (options.interlaced) {
      args.push('--interlace');
    }
    if (options.optimizationLevel) {
      args.push("--optimize=".concat(options.optimizationLevel));
    }
    if (options.colors) {
      args.push("--colors=".concat(options.colors));
    }
    const {
      stdout
    } = await execa(gifsicle, args, {
      encoding: null,
      input
    });
    return stdout;
  };
};