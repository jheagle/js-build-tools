import nodeTree from './nodeTree'

describe('nodeTree', () => {
  test('has sample nodeTree object', () => {
    expect(nodeTree.name).toBe('one')
    expect(nodeTree.parent).toBeNull()
    expect(nodeTree.children.length).toBe(2)
    expect(nodeTree.children[0].name).toBe('child one')
    expect(nodeTree.children[0].parent).toBe(nodeTree)
    expect(nodeTree.children[0].children.length).toBe(1)
    expect(nodeTree.children[0].children[0].name).toBe('grandchild one')
    expect(nodeTree.children[0].children[0].parent).toBe(nodeTree.children[0])
    expect(nodeTree.children[0].children[0].children.length).toBe(0)
    expect(nodeTree.children[1].name).toBe('child two')
    expect(nodeTree.children[1].parent).toBe(nodeTree)
    expect(nodeTree.children[1].children.length).toBe(0)
  })
})
