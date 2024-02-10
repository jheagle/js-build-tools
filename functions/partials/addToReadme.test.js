const fs = require('fs')
const setUp = require('../test-helpers/setUp')
setUp.setDefaults('test-add-to-readme')
const gulpConfig = setUp.gulpConfig
gulpConfig.set('dist.from', 'test-temp/src/addToReadme.js')
const addToReadme = require('./addToReadme')

const rawContents = '/**\n' +
  ' * Say hello with a given name.\n' +
  ' * @param {string} name\n' +
  ' * @returns {string}\n' +
  ' */\n' +
  'const sayHello = name => `Hello from ${name}`\n' +
  '\n' +
  'module.exports = sayHello\n'

beforeEach(() => setUp.beforeEach()
  .then(() => fs.writeFileSync(gulpConfig.get('srcPath') + '/addToReadme.js', rawContents)))

afterEach(setUp.afterEach)

describe('addToReadme', () => {
  test('generates the documentation', async () => {
    const readmeFilePath = gulpConfig.get('readme.to') + gulpConfig.get('readme.file')
    expect.assertions(2)
    await addToReadme()
    await expect(fs.existsSync(readmeFilePath)).toBeTruthy()
    const readme = await fs.readFileSync(readmeFilePath)
    // At least the documentation will have the addToReadme documentation
    await expect(readme.includes('sayHello')).toBeTruthy()
  })
})