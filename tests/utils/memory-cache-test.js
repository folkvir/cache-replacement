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
  it('hits function', function () {
    const a = new Memcache()
    a.set('toto', 4)
    a.get('toto')
    assert.equal(a.hits(), 1)
  })
  it('misses function', function () {
    const a = new Memcache()
    a.set('toto', 4)
    a.get('titi')
    assert.equal(a.misses(), 1)
    assert.equal(a.hits(), 0)
  })
})
