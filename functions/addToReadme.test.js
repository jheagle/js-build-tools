const fs = require('fs')
const fsExtra = require('fs-extra')
const gulpConfig = require('../gulp.config.js')
const setUp = require('../tests/setUp')
const addToReadme = require('./addToReadme')

beforeEach(() => setUp.beforeEach()
  .then(() => fsExtra.copySync('functions', gulpConfig.get('srcPath'))))

afterEach(setUp.afterEach)

describe('addToReadme', () => {
    test('generates the documentation', () => {
        const readmePath = gulpConfig.get('readmePath')
        expect.assertions(3)
        expect(fs.existsSync(readmePath)).toBeFalsy()
        addToReadme(async () => {
            await expect(fs.existsSync(readmePath)).toBeTruthy()
            const readme = await fs.readFileSync(readmePath)
            // At least the documentation will have the addToReadme documentation
            await expect(readme.includes('addToReadme')).toBeTruthy()
        })
    })
})