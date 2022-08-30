'use strict'

module.exports = {
  plugins: ['plugins/markdown'],
  source: {
    include: 'functions',
    includePattern: '.+\\.js(doc|x)?$',
    excludePattern: '((^|\\/|\\\\)_|.+\\.test\\..*)'
  },
}