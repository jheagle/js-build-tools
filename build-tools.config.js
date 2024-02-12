module.exports = {
  browser: {
    name: 'js-build-tools',
    from: 'dist/*.js',
    to: 'browser',
    enabled: false,
  },
  cleanPaths: ['dist', 'browser'],
  dist: {
    main: 'gulpfile.base.js',
    from: 'functions/**/!(*.test).js',
    to: 'dist',
  },
  readme: {
    template: 'MAIN.md',
    options: 'utf8',
    toFile: 'README.md',
    from: ['gulpfile.base.js', 'gulp.config.js', 'functions/!(*.test).js', 'functions/partials/!(*.test).js', 'functions/test-helpers/!(*.test).js'],
    to: './'
  },
  rootPath: './',
  sass: {
    outPath: 'browser/css',
    sassPath: 'sass',
    sassSearch: 'sass/**/*.+(scss|sass)',
    enabled: false
  },
  srcPath: 'functions',
  test: {
    options: {
      clearCache: false,
      debug: false,
      ignoreProjects: false,
      json: false,
      selectProjects: false,
      showConfig: false,
      useStderr: false,
      watch: false,
      watchAll: false,
    },
    path: 'functions',
    watch: 'functions/**/*.js'
  },
  typescript: {
    config: false,
    from: 'functions/**/*.ts',
    to: 'dist',
    enabled: false
  },
}
