const { dest, parallel, src } = require('gulp')
const gulpConfig = require('../../gulp.config.js')
const ts = require('gulp-typescript')

/**
 * Starting at the source directory, find all the ts files and convert them into the distribution directory.
 * @memberOf module:partials
 * @param {string|array} [srcPath='']
 * @param {string} [distPath='']
 * @returns {Function}
 * @see `https://www.typescriptlang.org/docs/handbook/gulp.html` for more info
 */
const tsFor = (srcPath = gulpConfig.get('typescript.from'), distPath = gulpConfig.get('typescript.to')) => {
  const declarationProject = ts.createProject(gulpConfig.get('typescript.config'))
  const tsProject = ts.createProject(gulpConfig.get('typescript.config'))
  const makeDeclarations = () => src(srcPath).pipe(declarationProject()).dts.pipe(dest(distPath))
  const compileJS = () => src(srcPath).pipe(tsProject()).js.pipe(dest(distPath))
  return parallel(makeDeclarations, compileJS)
}

module.exports = tsFor
