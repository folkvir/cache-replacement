const lmerge = require('lodash.merge');
const EventEmitter = require('events');
const FIFOPolicy = require('./policies/fifo.js');
const LIFOPolicy = require('./policies/lifo.js');
const LRUPolicy = require('./policies/lru.js');
const LFUPolicy = require('./policies/lfu.js');
const MRUPolicy = require('./policies/mru.js');
const MFUPolicy = require('./policies/mfu.js');
let Cache = require('./default-cache/abstract-cache.js')

class CacheReplacementPolicy {
  constructor () {
    this._policies = new Map();
    this.addPolicy('fifo', FIFOPolicy)
    this.addPolicy('lifo', LIFOPolicy)
    this.addPolicy('lru', LRUPolicy)
    this.addPolicy('lfu', LFUPolicy)
    this.addPolicy('mru', MRUPolicy)
    this.addPolicy('mfu', MFUPolicy)
  }

  /**
   * Initialize the cache by verifying the interface
   * @param  {[type]} cache   [description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  createCache(cache, options) {
    // create mixin with external cache and our to match the abstract-cache
    const tmp = class TmpCache extends Cache(cache) {};
    return new tmp(options);
  }

  /**
   * Add listeners of any method listed on the object methods in a cache.
   */
  _initPolicy (methods, cache) {
    if(methods.length === 0) throw new Error('Need array of function\'s name for the policy trigger.');
    methods.forEach(method => {
      const saveMethod = cache[method];
      cache[method] = (...args) => {
        return saveMethod(...args).then(r => {
          cache._events.emit(method, ...args, Promise.resolve(r));
          return Promise.resolve(r);
        }).catch(e => {
          return Promise.reject(r);
        });
      }
    })
  }

  /**
   * set the policy method for the current cache
   * @param {[type]} name [description]
   */
  setPolicy (name, cache) {
    try {
      // init the cache with new listeners
      this._initPolicy(this._policies.get(name).methods, cache);
      // apply policy using listeners
      this._policies.get(name).apply(cache);
    } catch (e) {
      console.error(e);
    }
  }

  addPolicy(name, policyClass){
      this._policies.set(name, new policyClass());
  }

  /**
   * Redefine the policy for a specific function of a cache
   * @param  {[type]}   name     [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  _definePolicy (name, cache, callback) {
    if(this._defaultOptions.methods.includes(name)) {
      this._events.on(name, callback);
    } else {
      throw new Error(`Name: ${name} is not a defined method for our policy trigger`)
    }
  }
}


module.exports = CacheReplacementPolicy;
