import fs from 'fs'
import { jest } from '@jest/globals'
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

  test('starts an empty readme, with a warning, when the template does not exist', async () => {
    const readmeFilePath = gulpConfig.get('readme.to') + gulpConfig.get('readme.file')
    fs.writeFileSync(readmeFilePath, 'old contents')
    gulpConfig.set('readme.template', 'does-not-exist.md')
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      await readmeTemplate()
      expect(fs.readFileSync(readmeFilePath, 'utf8')).toBe('')
      expect(warn).toHaveBeenCalledWith(expect.stringMatching(/does-not-exist\.md.*readme\.enabled/))
    } finally {
      warn.mockRestore()
      gulpConfig.set('readme.template', mainTestPath)
    }
  })
})
