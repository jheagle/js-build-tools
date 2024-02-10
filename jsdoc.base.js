const gulpConfig = require('./gulp.config.js')

module.exports = {
  plugins: ['plugins/markdown'],
  source: {
    include: [gulpConfig.get('dist.to')],
    includePattern: '.+\\.js(doc|x)?$',
    excludePattern: '((^|\\/|\\\\)_|.+\\.test\\..*)'
  },
}
