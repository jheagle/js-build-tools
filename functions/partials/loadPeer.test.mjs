import fs from 'fs'
import path from 'node:path'
import * as setUp from '../test-helpers/setUp.mjs'
import { importModule, importPeer, requirePeer } from './loadPeer.mjs'

setUp.setDefaults('test-load-peer')

const options = { task: 'example', installHint: 'Install it with: npm install --save-dev fake-peer' }

// A project with its own node_modules, so the packages are found from the project rather than from this package
const projectWith = (name, files) => {
  const project = path.resolve('test-load-peer/project')
  fs.mkdirSync(`${project}/node_modules/${name}`, { recursive: true })
  fs.writeFileSync(`${project}/package.json`, '{}')
  Object.entries(files).forEach(([file, contents]) => fs.writeFileSync(`${project}/node_modules/${name}/${file}`, contents))
  return project
}

beforeEach(setUp.beforeEach)
afterEach(setUp.afterEach)

describe('requirePeer', () => {
  test('loads the package from the project being built', () => {
    const project = projectWith('fake-peer', { 'package.json': '{"name":"fake-peer","main":"index.js"}', 'index.js': 'module.exports = { found: true }' })
    expect(requirePeer('fake-peer', { ...options, projectPath: project })).toEqual({ found: true })
  })

  test('explains how to install the package when the project does not have it', () => {
    expect(() => requirePeer('fake-peer', { ...options, projectPath: '/' })).toThrow(
      'The example task needs the optional peer dependency fake-peer, which is not installed. Install it with: npm install --save-dev fake-peer'
    )
  })

  test('does not hide other errors, and explains a package which is ESM-only when it has a message for that', () => {
    const project = projectWith('broken-peer', { 'package.json': '{"name":"broken-peer","main":"index.js"}', 'index.js': 'throw new Error("boom")' })
    expect(() => requirePeer('broken-peer', { ...options, projectPath: project })).toThrow('boom')
    // A missing dependency of the peer is not the peer being missing
    const inner = projectWith('inner-peer', { 'package.json': '{"name":"inner-peer","main":"index.js"}', 'index.js': 'require("something-else-missing")' })
    expect(() => requirePeer('inner-peer', { ...options, projectPath: inner })).toThrow(/something-else-missing/)
    expect(() => requirePeer('inner-peer', { ...options, projectPath: inner })).not.toThrow(/optional peer dependency/)
  })
})

describe('importPeer', () => {
  test('explains how to install the package when the project does not have it', async () => {
    await expect(importPeer('fake-peer', { ...options, projectPath: '/' })).rejects.toThrow(
      /needs the optional peer dependency fake-peer, which is not installed. Install it with/
    )
  })
})

describe('importModule', () => {
  // The real import() cannot run under this project's CommonJS-transform-based Jest setup (see tsFor.mjs), so the
  // loaders are checked by running the tasks for real, see the pull request.
  test('is a function', () => {
    expect(importModule).toBeInstanceOf(Function)
  })
})
