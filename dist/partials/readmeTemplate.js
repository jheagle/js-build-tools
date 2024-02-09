"use strict";

const {
  dest,
  src
} = require('gulp');
const gulpConfig = require('../../gulp.config.js');
const rename = require('gulp-rename');

/**
 * Copy a readme template into the README.md file.
 * @memberOf module:partials
 * @returns {*}
 */
const readmeTemplate = () => src(gulpConfig.get('readmeTemplate')).pipe(rename(gulpConfig.get('readmeFile'))).pipe(dest(gulpConfig.get('readmePath')));
module.exports = readmeTemplate;