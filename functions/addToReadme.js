const filenames = require('gulp-filenames')
const fs = require('fs')
const gulpConfig = require('../gulp.config.js')
const jsdoc2md = require('jsdoc-to-markdown')
const { src } = require('gulp')

module.exports = () => src(gulpConfig.srcSearch)
  .pipe(filenames('readme'))
  .on('end', () => {
    const readme = jsdoc2md.renderSync({ files: filenames.get('readme').map(file => `${gulpConfig.srcPath}/${file}`) })
    fs.appendFileSync('README.md', readme, 'utf8')
    return readme
  })
