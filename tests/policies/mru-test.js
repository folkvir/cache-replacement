const Cache = require('./../../src/default-cache/node-cache.js');
const CacheReplacementPolicy = require('./../../src/main.js');
const assert = require('assert');

const ENABLE_PRINT = false;

const print = (cache) => {
  if(ENABLE_PRINT) {
    console.log('Print the mru queue: ');
    cache._variables.get('mruqueue').forEach(function(val, node) {
      console.log(`** ${val}`);
    });
  }
};

describe('Testing the MRU policy', function() {
  it('should return undefined when no element in the cache',  function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache);
    cr.setPolicy('mru', cache)
    assert.deepEqual( cache.get('titi'), undefined);
  });
  it('should return true when adding a not exeisting element',  function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache);
    cr.setPolicy('mru', cache)
    assert.deepEqual( cache.set('titi', 42), true);
  });
  it('should return 42 when retreiving an existing element',  function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache);
    cr.setPolicy('mru', cache)
    const r =  cache.set('titi', 42);
    assert.deepEqual(r, true);
    const r1 =  cache.get('titi');
    assert.deepEqual(r1, 42);
  });
  it('should set the second element correctly (cache size = 1)',  function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache, {max: 1});
    cr.setPolicy('mru', cache)
    const r =  cache.set('titi', 42);
    const r1 =  cache.set('toto', 43);
    const r2 =  cache.get('titi')
    const r3 =  cache.get('toto')
    assert.deepEqual(r2, undefined)
    assert.deepEqual(r3, 43)
    assert.deepEqual( cache.size(), 1);
  });
  it('should re-set the same variable correctly instead of deleting it (cache size = 1)',  function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache, {max: 1});
    cr.setPolicy('mru', cache)
    const r =  cache.set('titi', 42);
    const r1 =  cache.set('titi', 43);
    const r2 =  cache.get('titi')
    assert.deepEqual(r2, 43);
    assert.deepEqual( cache.size(), 1);
  });
  it('should correctly delete the most recently used element [method get] (cache size =2)',  function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache, {max: 2});
    cr.setPolicy('mru', cache)
    const r =  cache.set('titi', 42);
    const r1 =  cache.set('toto', 43);
    const r2 =  cache.get('titi');
    const r3 =  cache.set('tata', 44);
    const r4 =  cache.get('iti');
    assert.deepEqual(r4, undefined);
    assert.deepEqual( cache.size(), 2);
  });
  it('should correctly delete the most recently used element [method has] (cache size =2)',  function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache, {max: 2});
    cr.setPolicy('mru', cache)
    const r =  cache.set('titi', 42);
    const r1 =  cache.set('toto', 43);
    const r2 =  cache.has('titi');
    const r3 =  cache.set('tata', 44);
    const r4 =  cache.get('titi');
    assert.deepEqual(r2, true);
    assert.deepEqual(r4, undefined);
    assert.deepEqual( cache.size(), 2);
  });
  it('should correctly delete the most recently used element [method set] (cache size =3)',  function() {
    let cr = new CacheReplacementPolicy();
    let cache = cr.createCache(Cache, {max: 3});
    cr.setPolicy('mru', cache)
    const r =  cache.set('titi', 42);
    print(cache);
    assert.deepEqual(cache._variables.get('mruqueue').last(), 'titi');
    assert.deepEqual(cache._variables.get('mruqueue').first(), 'titi');
    const r1 =  cache.set('toto', 43);
    print(cache);
    assert.deepEqual(cache._variables.get('mruqueue').last(), 'toto');
    assert.deepEqual(cache._variables.get('mruqueue').first(), 'titi');
    assert.equal(r1, true);
    const r2 =  cache.set('titi', 56);
    print(cache);
    assert.deepEqual(cache._variables.get('mruqueue').last(), 'titi');
    assert.deepEqual(cache._variables.get('mruqueue').first(), 'toto');
    assert.equal(r2, true);
    const r3 =  cache.set('tata', 44);
    assert.equal(r3, true);
    print(cache);
    assert.deepEqual(cache._variables.get('mruqueue').last(), 'tata');
    assert.deepEqual(cache._variables.get('mruqueue').first(), 'toto');
    const r4 =  cache.set('tutu', "Qu'est-ce qu'un élémentaire de fromage ? un emmental !");
    // now we have toto => titi => tata => tutu
    print(cache);
    assert.deepEqual(cache._variables.get('mruqueue').last(), 'tutu');
    assert.deepEqual(cache._variables.get('mruqueue').first(), 'toto');
    // now we have toto => titi => tata => tutu
    print(cache);
    const r5 =  cache.get('titi');
    assert.deepEqual(r5, 56);
    // now we have toto => tata => tutu => titi
    assert.deepEqual(cache._variables.get('mruqueue').last(), 'titi');
    assert.deepEqual(cache._variables.get('mruqueue').first(), 'toto');
    assert.deepEqual( cache.size(), 3);
  });
});
