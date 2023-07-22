const fs = require('fs')
const gulpConfig = require('../gulp.config.js')
const setUp = require('./test-helpers/setUp')
const readmeTemplate = require('./readmeTemplate')

const mainMd = 'MAIN.md'
const mainTestPath = gulpConfig.get('readmeTemplate')

beforeEach(() => setUp.beforeEach()
  .then(() => fs.copyFileSync(mainMd, mainTestPath)))

afterEach(setUp.afterEach)

describe('readmeTemplate', () => {
  test('copies the main contents into the new README.md', done => {
    const readmeFilePath = gulpConfig.get('readmePath') + gulpConfig.get('readmeFile')
    const mainContents = fs.readFileSync(mainTestPath)
    expect.assertions(2)
    readmeTemplate()
      .on('finish', async () => {
        await expect(fs.existsSync(readmeFilePath)).toBeTruthy()
        const readme = await fs.readFileSync(readmeFilePath)
        // Confirm that the contents for MAIN.md are copied to README.md
        await expect(readme).toEqual(mainContents)
        done()
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done()
      })
  })
})
