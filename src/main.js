const lmerge = require('lodash.merge');
const EventEmitter = require('events');
const Cache = require('./default-cache/cache.js')

const FifoPolicy = require('./policies/fifo.js');

class CacheReplacementPolicy {
  constructor () {
    this._policies = new Map();
    this._policies.set('fifo', new FifoPolicy());
  }

  createCache(cache, options) {
    return new Cache(cache, options);
  }

  /**
   * Add listeners of any method listed on the object methods in a cache.
   */
  _initPolicy (methods, cache) {
    console.log('Methods defined: ', methods);
    if(methods.length === 0) throw new Error('Need array of function\'s name for the policy trigger.');
    methods.forEach(method => {
      const saveMethod = cache[method];
      cache[method] = (...args) => {
        console.log('', saveMethod);
        const resSaveMethod = saveMethod(...args);
        cache._events.emit(method, ...args, resSaveMethod);
        return resSaveMethod;
      }
    })
    console.log('Initialized...');
  }

  /**
   * set the policy method for the current cache
   * @param {[type]} name [description]
   */
  setPolicy (name, cache) {
    try {
      this._initPolicy(this._policies.get(name).methods, cache);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * [_definePolicy description]
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
