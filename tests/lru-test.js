const Cache = require('./../src/default-cache/node-cache.js');
const CacheReplacementPolicy = require('./../src/main.js');
const assert = require('assert');

const ENABLE_PRINT = false;

const print = (cache) => {
  if(ENABLE_PRINT) {
    console.log('Print the lru queue: ');
    cache._variables.get('lruqueue').forEach(function(val, node) {
      console.log(`** ${val}`);
    });
  }
};

describe('Testing the LRU policy', function() {
  it('should return undefined when no element in the cache', async function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache);
    cr.setPolicy('lru', cache)
    const g = await cache.get('titi');
    assert.deepEqual(g, undefined);
  });
  it('should return true when adding a not exeisting element', async function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache);
    cr.setPolicy('lru', cache)
    assert.deepEqual(await cache.set('titi', 42), true);
  });
  it('should return 42 when retreiving an existing element', async function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache);
    cr.setPolicy('lru', cache)
    const r = await cache.set('titi', 42);
    assert.deepEqual(r, true);
    const r1 = await cache.get('titi');
    assert.deepEqual(r1, 42);
  });
  it('should set the second element correctly (cache size = 1)', async function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache, {max: 1});
    cr.setPolicy('lru', cache)
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
    cr.setPolicy('lru', cache)
    const r = await cache.set('titi', 42);
    const r1 = await cache.set('titi', 43);
    const r2 = await cache.get('titi')
    assert.deepEqual(r2, 43);
    assert.deepEqual(await cache.size(), 1);
  });
  it('should correctly delete the least recently used element [method get] (cache size =2)', async function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache, {max: 2});
    cr.setPolicy('lru', cache)
    const r = await cache.set('titi', 42);
    const r1 = await cache.set('toto', 43);
    const r2 = await cache.get('titi');
    const r3 = await cache.set('tata', 44);
    const r4 = await cache.get('toto');
    assert.deepEqual(r4, undefined);
    assert.deepEqual(await cache.size(), 2);
  });
  it('should correctly delete the least recently used element [method has] (cache size =2)', async function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache, {max: 2});
    cr.setPolicy('lru', cache)
    const r = await cache.set('titi', 42);
    const r1 = await cache.set('toto', 43);
    const r2 = await cache.has('titi');
    const r3 = await cache.set('tata', 44);
    const r4 = await cache.get('toto');
    assert.deepEqual(r2, true);
    assert.deepEqual(r4, undefined);
    assert.deepEqual(await cache.size(), 2);
  });
  it('should correctly delete the least recently used element [method set] (cache size =3)', async function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache, {max: 3});
    cr.setPolicy('lru', cache)
    const r = await cache.set('titi', 42);
    print(cache);
    assert.deepEqual(cache._variables.get('lruqueue').last(), 'titi');
    const r1 = await cache.set('toto', 43);
    print(cache);
    assert.deepEqual(cache._variables.get('lruqueue').last(), 'toto');
    assert.equal(r1, true);
    const r2 = await cache.set('titi', 56);
    print(cache);
    assert.deepEqual(cache._variables.get('lruqueue').last(), 'titi');
    assert.deepEqual(cache._variables.get('lruqueue').first(), 'toto');
    assert.equal(r2, true);
    const r3 = await cache.set('tata', 44);
    assert.equal(r3, true);
    print(cache);
    assert.deepEqual(cache._variables.get('lruqueue').last(), 'tata');
    assert.deepEqual(cache._variables.get('lruqueue').first(), 'toto');
    const r4 = await cache.set('tutu', "Qu'est-ce qu'un élémentaire de fromage ? un emmental !");
    // now we have toto => titi => tata => tutu
    print(cache);
    assert.deepEqual(cache._variables.get('lruqueue').last(), 'tutu');
    assert.deepEqual(cache._variables.get('lruqueue').first(), 'titi');
    // now we have toto => titi => tata => tutu
    print(cache);
    const r5 = await cache.get('titi');
    assert.deepEqual(r5, 56);
    // now we have toto => tata => tutu => titi
    assert.deepEqual(cache._variables.get('lruqueue').last(), 'titi');
    assert.deepEqual(cache._variables.get('lruqueue').first(), 'tata');
    assert.deepEqual(await cache.size(), 3);
  });
});
