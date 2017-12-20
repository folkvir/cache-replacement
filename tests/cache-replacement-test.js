const Cache = require('./../src/default-cache/node-cache.js');
const CacheReplacementPolicy = require('./../src/main.js');
const assert = require('assert');

describe('Cache Replacement Policy', function() {
  describe('Creation of the main class', function() {
    it('should return no error during the creation of cache-replacement main class', function() {
      try {
        let cr = new CacheReplacementPolicy();
      } catch (e) {
        assert('An error occured during the creation of the cache...', e);
      }
    });
  });
  describe('Initialization of the cache', function() {
    it('should return no error during the initialization of the cache', function() {
      try {
        let cr = new CacheReplacementPolicy();
        let cache = cr.createCache(Cache);
      } catch (e) {
        assert('An error occured during the initialization of the cache...', e);
      }
    });
  });
});

describe('Setting policies', function() {
  it('should return no error when setting the fifo policy', function() {
    try {
      let cr = new CacheReplacementPolicy();
      let cache = cr.createCache(Cache);
      cr.setPolicy('fifo', cache)
    } catch (e) {
      assert('An error occured when setting the replacement policy of the cache...', e);
    }
  });
  it('should return no error when setting the lifo policy', function() {
    try {
      let cr = new CacheReplacementPolicy();
      let cache = cr.createCache(Cache);
      cr.setPolicy('lifo', cache)
    } catch (e) {
      assert('An error occured when setting the replacement policy of the cache...', e);
    }
  });
});
