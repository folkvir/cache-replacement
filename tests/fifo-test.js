const Cache = require('./../src/default-cache/node-cache.js');
const CacheReplacementPolicy = require('./../src/main.js');
const assert = require('assert');

describe('Testing the FIFO policy', function() {
  it('should return undefined when no element in the cache', async function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache);
    cr.setPolicy('fifo', cache)
    const g = await cache.get('titi');
    assert.deepEqual(g, undefined);
  });
  it('should return true when adding a not exeisting element', async function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache);
    cr.setPolicy('fifo', cache)
    assert.deepEqual(await cache.set('titi', 42), true);
  });
  it('should return 42 when retreiving an existing element', async function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache);
    cr.setPolicy('fifo', cache)
    const r = await cache.set('titi', 42);
    assert.deepEqual(r, true);
    const r1 = await cache.get('titi');
    assert.deepEqual(r1, 42);
  });
  it('should set the second element correctly (cache size = 1)', async function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache, {max: 1});
    cr.setPolicy('fifo', cache)
    const r = await cache.set('titi', 42);
    const r1 = await cache.set('toto', 43);
    const r2 = await cache.get('titi')
    const r3 = await cache.get('toto')
    assert.deepEqual(r2, undefined)
    assert.deepEqual(r3, 43)
    assert.deepEqual(await cache.size(), 1);
  });
  it('should re-set the same variable correctly instead of deleting it (cache size = 1)', async function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache, {max: 1});
    cr.setPolicy('fifo', cache)
    const r = await cache.set('titi', 42);
    const r1 = await cache.set('titi', 43);
    const r2 = await cache.get('titi')
    assert.deepEqual(r2, 43);
    assert.deepEqual(await cache.size(), 1);
  });
  it('should correctly delete the first element (cache size =2)', async function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache, {max: 2});
    cr.setPolicy('fifo', cache)
    const r = await cache.set('titi', 42);
    const r1 = await cache.set('toto', 43);
    const r2 = await cache.set('tata', 44);
    const r3 = await cache.get('titi'), r4 = await cache.get('toto'), r5 = await cache.get('tata');
    assert.deepEqual(r3, undefined);
    assert.deepEqual(r4, 43);
    assert.deepEqual(r5, 44);
    assert.deepEqual(await cache.size(), 2);
  });
});
