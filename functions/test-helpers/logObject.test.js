const logObject = require('./logObject')
const util = require('util')

describe('logObject', () => {
  test('can nicely output objects', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(jest.fn())
    const inspectSpy = jest.spyOn(util, 'inspect')
    const someObject = { one: 1, two: 2, three: 3 }
    logObject(someObject, 'someObject')
    expect(inspectSpy).toHaveBeenCalledWith(someObject, false, null, true)
    expect(logSpy).toHaveBeenCalledWith('someObject', util.inspect(someObject, false, null, true))
  })

  test('output to string when that argument is provided', () => {
    const someObject = { one: 1, two: 2, three: 3 }
    const label = 'someObject'
    const result = logObject(someObject, label, 'string')
    expect(result).toEqual(`'${label}' | ` + JSON.stringify(someObject))
  })
})
