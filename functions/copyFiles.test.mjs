import fs from 'fs'
import * as setUp from './test-helpers/setUp.mjs'
import { copyFiles } from './copyFiles.mjs'

setUp.setDefaults('test-copy-files')
const gulpConfig = setUp.gulpConfig

beforeEach(() => setUp.beforeEach())
afterEach(() => {
  gulpConfig.set('copyFiles', [])
  return setUp.afterEach()
})

describe('copyFiles', () => {
  test('with no entries configured, does nothing and resolves', async () => {
    await expect(copyFiles()).resolves.toBeUndefined()
  })

  test('copies a file from one place to another', async () => {
    const sourceDir = `${gulpConfig.get('rootPath')}copy-source`
    const destDir = `${gulpConfig.get('rootPath')}copy-dest`
    fs.mkdirSync(sourceDir, { recursive: true })
    fs.writeFileSync(`${sourceDir}/one.txt`, 'one file\n')
    gulpConfig.set('copyFiles', [{ from: `${sourceDir}/*.txt`, to: destDir }])

    await copyFiles()

    expect(fs.readFileSync(`${destDir}/one.txt`).toString()).toBe('one file\n')
  })

  test('copies several configured entries, each to its own destination', async () => {
    const sourceDirA = `${gulpConfig.get('rootPath')}copy-source-a`
    const sourceDirB = `${gulpConfig.get('rootPath')}copy-source-b`
    const destDirA = `${gulpConfig.get('rootPath')}copy-dest-a`
    const destDirB = `${gulpConfig.get('rootPath')}copy-dest-b`
    fs.mkdirSync(sourceDirA, { recursive: true })
    fs.mkdirSync(sourceDirB, { recursive: true })
    fs.writeFileSync(`${sourceDirA}/a.txt`, 'from a\n')
    fs.writeFileSync(`${sourceDirB}/b.txt`, 'from b\n')
    gulpConfig.set('copyFiles', [
      { from: `${sourceDirA}/*.txt`, to: destDirA },
      { from: `${sourceDirB}/*.txt`, to: destDirB }
    ])

    await copyFiles()

    expect(fs.readFileSync(`${destDirA}/a.txt`).toString()).toBe('from a\n')
    expect(fs.readFileSync(`${destDirB}/b.txt`).toString()).toBe('from b\n')
  })

  test('base preserves the glob\'s own subdirectory structure in the destination', async () => {
    const sourceDir = `${gulpConfig.get('rootPath')}copy-source-nested`
    const destDir = `${gulpConfig.get('rootPath')}copy-dest-nested`
    fs.mkdirSync(`${sourceDir}/inner`, { recursive: true })
    fs.writeFileSync(`${sourceDir}/inner/deep.txt`, 'nested file\n')
    gulpConfig.set('copyFiles', [{ from: `${sourceDir}/**/*.txt`, to: destDir, base: sourceDir }])

    await copyFiles()

    expect(fs.readFileSync(`${destDir}/inner/deep.txt`).toString()).toBe('nested file\n')
  })
})
