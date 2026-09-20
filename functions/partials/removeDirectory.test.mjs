import fs from 'fs'
import { rm } from 'node:fs/promises'
import { removeDirectory } from './removeDirectory.mjs'

// Wrap rm so tests can simulate something recreating the directory while (or right after) it is deleted.
jest.mock('node:fs/promises', () => {
  const actual = jest.requireActual('node:fs/promises')
  return { ...actual, rm: jest.fn(actual.rm) }
})
const { rm: realRm } = jest.requireActual('node:fs/promises')

const dirPath = 'remove-directory'
const recreateAfterRemoving = async (target, options) => {
  await realRm(target, options)
  fs.mkdirSync(target)
}

afterEach(() => {
  rm.mockReset()
  rm.mockImplementation(realRm)
  fs.rmSync(dirPath, { recursive: true, force: true })
})

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

  test('removes with force and Node\'s built-in retry-with-back-off for busy or locked directories', async () => {
    expect.assertions(1)
    fs.mkdirSync(dirPath)
    await removeDirectory(dirPath)
    expect(rm).toHaveBeenCalledWith(dirPath, expect.objectContaining({ recursive: true, force: true, maxRetries: 5 }))
  })

  test('removes the directory again when something recreates it right after the first removal', async () => {
    expect.assertions(2)
    fs.mkdirSync(dirPath)
    rm.mockImplementationOnce(recreateAfterRemoving)
    await removeDirectory(dirPath)
    expect(fs.existsSync(dirPath)).toBeFalsy()
    expect(rm).toHaveBeenCalledTimes(2)
  })

  test('fails with a clear error instead of leaving stale output when the directory keeps coming back', async () => {
    expect.assertions(2)
    fs.mkdirSync(dirPath)
    rm.mockImplementation(recreateAfterRemoving)
    await expect(removeDirectory(dirPath)).rejects.toThrow(/Unable to remove "remove-directory" - it was recreated or is locked/)
    expect(rm).toHaveBeenCalledTimes(4)
  })
})
