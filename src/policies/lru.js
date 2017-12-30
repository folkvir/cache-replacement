const debug = require('debug')('lru');
const FifoQueue = require('../utils/map-double-linked-list.js');



module.exports = class LRUPolicy {
  constructor(options) {
    this._methods = ['set', 'del', 'clear', 'get'];
  }
  get methods () {
    return this._methods;
  }

  apply(cache) {
    // initialize variable for ou policy
    const options = cache._options[0] === undefined && { max: Infinity } || cache._options[0];
    cache._variables.set('options', options)
    cache._variables.set('lruqueue', new FifoQueue())
    this.policyGet(cache);
    this.policySet(cache);
    this.policyDel(cache);
    this.policyClear(cache);
  }

  policyGet(cache) {
    cache._events.on('get', (key, result) => {
      if(result) {
        const node = cache._variables.get('lruqueue').find(key);
        cache._variables.get('lruqueue').bump(node);
      }
    });
  }

  policySet(cache) {
    cache._events.on('set', (key, value, result) => {
      if(result && !cache._variables.get('lruqueue')._map.has(key)){
        const max = cache._variables.get('options').max, size = cache._variables.get('lruqueue').length;
        if(size >= max) {
          // delete the first element in the queue and delete the element in the cache
          const oldKey = cache._variables.get('lruqueue').shift();
          if(oldKey !== key) cache.del(oldKey);
        }
        cache._variables.get('lruqueue').push(key);
      } else {
        const node = cache._variables.get('lruqueue').find(key);
        cache._variables.get('lruqueue').bump(node);
      }
    });
  }

  policyDel(cache) {
    cache._events.on('del', (key, result) => {
      if(result) {
        cache._variables.get('lruqueue').remove(cache._variables.get('lruqueue').find(key));
      }
    });
  }

  policyClear(cache) {
    cache._events.on('clear', (result) => {
      cache._variables.get('lruqueue').clear();
    });
  }
}
