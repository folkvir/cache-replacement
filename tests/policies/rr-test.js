const Cache = require('../../cache-replacement').rr
const assert = require('assert')

describe('Testing the RR policy', function () {
  it('should correctly delete an element', function () {
    let cache = new Cache()
    cache.set('a', 'ade')
    cache.set('b', 'ade')
    cache.set('c', 'ade')
    cache.set('d', 'ade')
    cache.set('e', 'ade')
    assert.equal(cache.size(), 5)
    assert.equal(cache._array.length, 5)
    assert.equal(cache._correspondingKeys.size, 5)
    cache.del('c')
    cache.forEach((k, v) => {
      assert.equal(cache._array.includes(k), true)
    })
    assert.equal(cache.size(), 4)
    assert.equal(cache._array.length, 4)
    assert.equal(cache._correspondingKeys.size, 4)
  })
  it('should correctly delete an element with a fixed size=4', function () {
    let cache = new Cache({max: 4})
    cache.set('a', 'ade')
    cache.set('b', 'ade')
    cache.set('c', 'ade')
    cache.set('d', 'ade')
    cache.set('e', 'ade')
    assert.equal(cache.size(), 4)
    assert.equal(cache._array.length, 4)
    assert.equal(cache._correspondingKeys.size, 4)
  })
})
