'use strict'

const distFor = require('./distFor.js')

/**
 * Simplified distribution tasks which will use arguments from distFor.
 * @returns {*}
 */
const dist = () => distFor()
module.exports = dist
