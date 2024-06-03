import fs from 'fs'
import { removeDirectory } from './removeDirectory.mjs'

describe('removeDirectory', () => {
  test('able to delete the remove-directory', async () => {
    const dirPath = 'remove-directory'
    fs.mkdirSync(dirPath)
    expect(fs.existsSync(dirPath)).toBeTruthy()
    await removeDirectory(dirPath)
    expect(fs.existsSync(dirPath)).toBeFalsy()
  })

  test('able to delete directory with sub-directories', async () => {
    const dirPath = 'remove-directory'
    fs.mkdirSync(dirPath)
    const subDir = `${dirPath}/sub`
    fs.mkdirSync(subDir)
    expect(fs.existsSync(subDir)).toBeTruthy()
    await removeDirectory(dirPath)
    expect(fs.existsSync(subDir)).toBeFalsy()
  })

  test('ends cleanly if directory does not exist', async () => {
    const dirPath = 'remove-directory'
    expect(fs.existsSync(dirPath)).toBeFalsy()
    expect(await removeDirectory(dirPath)).toBe(dirPath)
  })
})
