module.exports = {
  browserName: 'js-build-tools',
  distMain: 'gulpfile.base.js',
  distSearch: 'dist/*.js',
  nodeOnly: true,
  readmeTemplate: 'MAIN.md',
  srcPath: 'functions',
  srcSearch: 'functions/!(*.test).js',
  testPath: ['functions'],
  useTsConfig: 'tsconfig.json',
  watchSearch: 'functions/*.js'
}
