const gulpConfig = require('./gulp.config.js')

module.exports = {
  plugins: ['plugins/markdown'],
  source: {
    include: gulpConfig.get('distPath'),
    includePattern: '.+\\.js(doc|x)?$',
    excludePattern: '((^|\\/|\\\\)_|.+\\.test\\..*)'
  },
}
