'use strict'

const sassFor = require('./partials/sassFor')

// Compile sass into CSS & auto-inject into browsers
const sass = () => sassFor()
module.exports = sass
