const Cache = require('../../cache-replacement').fifo
const assert = require('assert')

describe('Testing the FIFO policy', function () {
  it('should return undefined when no element in the cache', function () {
    let cache = new Cache()
    const g = cache.get('titi')
    assert.deepEqual(g, undefined)
  })
  it('should return true when adding a not exeisting element', function () {
    let cache = new Cache()
    assert.deepEqual(cache.set('titi', 42), true)
  })
  it('should return 42 when retreiving an existing element', function () {
    let cache = new Cache()
    const r = cache.set('titi', 42)
    assert.deepEqual(r, true)
    const r1 = cache.get('titi')
    assert.deepEqual(r1, 42)
  })
  it('should set the second element correctly (cache size = 1)', function () {
    let cache = new Cache({max: 1})
    cache.set('titi', 42)
    cache.set('toto', 43)
    const r2 = cache.get('titi')
    const r3 = cache.get('toto')
    assert.deepEqual(r2, undefined)
    assert.deepEqual(r3, 43)
    assert.deepEqual(cache.size(), 1)
  })
  it('should re-set the same variable correctly instead of deleting it (cache size = 1)', function () {
    let cache = new Cache({max: 2})
    cache.set('titi', 42)
    cache.set('titi', 43)
    const r2 = cache.get('titi')
    assert.deepEqual(r2, 43)
    assert.deepEqual(cache.size(), 1)
  })
  it('should correctly delete the first element (cache size =2)', function () {
    let cache = new Cache({max: 2})
    cache.set('titi', 42)
    cache.set('toto', 43)
    cache.set('tata', 44)
    const r3 = cache.get('titi')
    const r4 = cache.get('toto')
    const r5 = cache.get('tata')
    assert.deepEqual(r3, undefined)
    assert.deepEqual(r4, 43)
    assert.deepEqual(r5, 44)
    assert.deepEqual(cache.size(), 2)
  })
})
