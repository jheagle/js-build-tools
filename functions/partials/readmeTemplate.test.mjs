import fs from 'fs'
import * as setUp from '../test-helpers/setUp.mjs'
import { readmeTemplate } from './readmeTemplate.mjs'

setUp.setDefaults('test-readme-template')
const gulpConfig = setUp.gulpConfig

const mainMd = 'MAIN.md'
const mainTestPath = gulpConfig.get('readme.template')

beforeEach(() => setUp.beforeEach()
  .then(() => fs.copyFileSync(mainMd, mainTestPath)))

afterEach(setUp.afterEach)

describe('readmeTemplate', () => {
  test('copies the main contents into the new README.md', done => {
    const readmeFilePath = gulpConfig.get('readme.to') + gulpConfig.get('readme.file')
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
