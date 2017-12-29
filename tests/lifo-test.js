const Cache = require('./../src/default-cache/node-cache.js');
const CacheReplacementPolicy = require('./../src/main.js');
const assert = require('assert');

describe('Testing the LIFO policy', function() {
  it('should return undefined when no element in the cache', function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache);
    cr.setPolicy('fifo', cache)
    assert.deepEqual(cache.get('titi'), undefined);
  });
  it('should return true when adding a not exeisting element', function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache);
    cr.setPolicy('fifo', cache)
    assert.deepEqual(cache.set('titi', 42), true);
  });
  it('should return 42 when retreiving an existing element', function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache);
    cr.setPolicy('fifo', cache)
    const r = cache.set('titi', 42);
    assert.deepEqual(r, true);
    const r1 = cache.get('titi');
    assert.deepEqual(r1, 42);
  });
  it('should set the second element correctly (cache size = 1)', function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache, {max: 1});
    cr.setPolicy('fifo', cache)
    const r = cache.set('titi', 42);
    const r1 = cache.set('toto', 43);
    const r2 = cache.get('titi')
    const r3 = cache.get('toto')
    assert.deepEqual(r2, undefined)
    assert.deepEqual(r3, 43)
    assert.deepEqual(cache.size(), 1);
  });
  it('should re-set the same variable correctly instead of deleting it (cache size = 1)', function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache, {max: 1});
    cr.setPolicy('fifo', cache)
    const r = cache.set('titi', 42);
    const r1 = cache.set('titi', 43);
    const r2 = cache.get('titi')
    assert.deepEqual(r2, 43);
    assert.deepEqual(cache.size(), 1);
  });
  it('should correctly delete the last element (cache size =2)', function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache, {max: 2});
    cr.setPolicy('lifo', cache)
    const r = cache.set('titi', 42);
    const r1 = cache.set('toto', 43);
    const r2 = cache.set('tata', 44);
    const r3 = cache.get('titi'), r4 = cache.get('toto'), r5 = cache.get('tata');
    assert.deepEqual(r3, 42);
    assert.deepEqual(r4, undefined);
    assert.deepEqual(r5, 44);
    assert.deepEqual(cache.size(), 2);
  });
});
