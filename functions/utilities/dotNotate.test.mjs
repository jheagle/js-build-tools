import { dotNotate } from './dotNotate.mjs'

describe('dotNotate', () => {
  test('flattens a nested object into dot-notation leaves', () => {
    expect(dotNotate({ a: { b: 'c', d: { e: 'f' } } })).toEqual({ 'a.b': 'c', 'a.d.e': 'f' })
  })

  test('flattens a non-empty array into index-numbered leaves, same as a plain object', () => {
    expect(dotNotate({ a: ['x', 'y'] })).toEqual({ 'a.0': 'x', 'a.1': 'y' })
  })

  test('keeps a primitive value (including null) as its own leaf, unflattened', () => {
    expect(dotNotate({ a: 1, b: 'two', c: null })).toEqual({ a: 1, b: 'two', c: null })
  })

  test('keeps an empty object as a leaf value, rather than silently dropping its key', () => {
    expect(dotNotate({ a: {}, b: 'c' })).toEqual({ a: {}, b: 'c' })
  })

  test('keeps an empty array as a leaf value, rather than silently dropping its key', () => {
    expect(dotNotate({ a: [], b: 'c' })).toEqual({ a: [], b: 'c' })
  })

  test('keeps an empty object/array as a leaf even nested inside other objects', () => {
    expect(dotNotate({ a: { b: [], c: {} } })).toEqual({ 'a.b': [], 'a.c': {} })
  })

  test('retains a matching key as a whole object instead of flattening into it', () => {
    expect(dotNotate({ a: { b: 'c' }, options: { fix: true } }, ['options'])).toEqual({
      'a.b': 'c',
      options: { fix: true }
    })
  })
})
