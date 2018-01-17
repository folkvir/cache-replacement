const Memcache = require('../../cache-replacement').memorycache
const assert = require('assert')

describe('Memory cache wrapper', function () {
  it('Works fine', function () {
    const a = new Memcache()
    a.set('toto', 4)
    assert.equal(a.has('toto'), true)
    assert.equal(a.get('toto'), 4)
    assert.equal(a.size(), 1)
    a.clear()
    assert.equal(a.has('toto'), false)
    assert.equal(a.get('toto'), undefined)
    assert.equal(a.size(), 0)
  })
})
