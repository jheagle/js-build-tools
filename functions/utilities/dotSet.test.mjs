import { dotSet } from './dotSet.mjs'

describe('dotSet', () => {
  test('sets a value on an existing path', () => {
    expect(dotSet({ a: { b: 1 } }, 'a.b', 2)).toEqual({ a: { b: 2 } })
  })

  test('creates a missing parent as a plain object for a named key', () => {
    const result = dotSet({}, 'group.setting', 'value')
    expect(Array.isArray(result.group)).toBe(false)
    expect(JSON.stringify(result)).toEqual('{"group":{"setting":"value"}}')
  })

  test('creates missing parents several levels deep as plain objects', () => {
    expect(dotSet({}, 'a.b.c', 1)).toEqual({ a: { b: { c: 1 } } })
  })

  test('creates a missing parent as an array for an index key', () => {
    expect(dotSet({}, 'list.0', 'first')).toEqual({ list: ['first'] })
    expect(dotSet({}, 'list.0.name', 'x')).toEqual({ list: [{ name: 'x' }] })
  })

  test('keeps an existing array parent', () => {
    expect(dotSet({ list: ['a'] }, 'list.1', 'b')).toEqual({ list: ['a', 'b'] })
  })

  test('sets every match of a wildcard', () => {
    expect(dotSet({ items: [{ n: 1 }, { n: 2 }] }, 'items.*.n', 0)).toEqual({ items: [{ n: 0 }, { n: 0 }] })
  })
})
