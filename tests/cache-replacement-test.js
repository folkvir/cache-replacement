const Cache = require('./../src/default-cache/node-cache.js');
const CacheReplacementPolicy = require('./../src/main.js');
const assert = require('assert');

describe('Cache Replacement Policy', function() {
  describe('Creation of the main class', function() {
    it('should return no error during the creation of cache-replacement main class', function() {
      assert.doesNotThrow(() => {
            let cr = new CacheReplacementPolicy();
      }, Error);
    });
  });
  describe('Initialization of the cache', function() {
    it('should return no error during the initialization of the cache', function() {
      assert.doesNotThrow(() => {
            let cr = new CacheReplacementPolicy();
            let cache = cr.createCache(Cache);
      }, Error);
    });
  });
});

describe('Setting policies for an async cache', function() {
  it('should return no error when setting the fifo policy', function() {
    assert.doesNotThrow(() => {
          let cr = new CacheReplacementPolicy();
          let cache = cr.createCache(Cache);
          cr.setPolicy('fifo', cache)
    }, Error);
  });
  it('should return no error when setting the lifo policy', function() {
    assert.doesNotThrow(() => {
          let cr = new CacheReplacementPolicy();
          let cache = cr.createCache(Cache);
          cr.setPolicy('lifo', cache)
    }, Error);
  });
  it('should return no error when setting the lru policy', function() {
    assert.doesNotThrow(() => {
          let cr = new CacheReplacementPolicy();
          let cache = cr.createCache(Cache);
          cr.setPolicy('lru', cache)
    }, Error);
  });
  it('should return no error when setting the lfu policy', function() {
    assert.doesNotThrow(() => {
          let cr = new CacheReplacementPolicy();
          let cache = cr.createCache(Cache);
          cr.setPolicy('lfu', cache)
    }, Error);
  });
  it('should return no error when setting the mru policy', function() {
    assert.doesNotThrow(() => {
          let cr = new CacheReplacementPolicy();
          let cache = cr.createCache(Cache);
          cr.setPolicy('mru', cache)
    }, Error);
  });

});
