module.exports = {
  browserName: 'js-build-tools',
  browserPath: 'browser',
  distMain: 'gulpfile.base.js',
  distPath: 'dist',
  distSearch: 'dist/*.js',
  nodeOnly: true,
  readmeFile: 'README.md',
  readmePath: './',
  readmeOptions: 'utf8',
  readmeTemplate: 'MAIN.md',
  readmeSearch: ['gulpfile.base.js', 'gulp.config.js', 'functions/**/!(*.test).js'],
  rootPath: './',
  srcPath: 'functions',
  srcSearch: 'functions/**/!(*.test).js',
  testOptions: {
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
  testPath: 'functions',
  useTsConfig: 'tsconfig.json',
  watchSearch: 'functions/*.js',
}
