const fs = require('fs')
const gulpConfig = require('../gulp.config.js')
gulpConfig.set('srcSearch', 'test-temp/src/addToReadme.js')
const setUp = require('../tests/setUp')
const addToReadme = require('./addToReadme')

beforeEach(() => setUp.beforeEach()
  .then(() => fs.copyFileSync('functions/addToReadme.js', gulpConfig.get('srcPath') + '/addToReadme.js')))

afterEach(setUp.afterEach)

describe('addToReadme', () => {
  test('generates the documentation', () => {
    const readmeFilePath = gulpConfig.get('readmePath') + gulpConfig.get('readmeFile')
    expect.assertions(2)
    addToReadme(async () => {
      await expect(fs.existsSync(readmeFilePath)).toBeTruthy()
      const readme = await fs.readFileSync(readmeFilePath)
      // At least the documentation will have the addToReadme documentation
      await expect(readme.includes('addToReadme')).toBeTruthy()
    })
  })
})