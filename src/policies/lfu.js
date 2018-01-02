const debug = require('debug')('lfu');
const LFUQueue = require('../utils/pmdll.js');


module.exports = class LFUPolicy {
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
    cache._variables.set('lfuqueue', new LFUQueue())
    this.policyGet(cache);
    this.policySet(cache);
    this.policyDel(cache);
    this.policyClear(cache);
  }

  policyGet(cache) {
    cache._events.on('get', (key, result) => {
      result.then(res => {
        res && cache._variables.get('lfuqueue').set(key);
      })
    });
  }

  policySet(cache) {
    cache._events.on('set', (key, value, result) => {
      result.then(res => {
        if(res && !cache._variables.get('lfuqueue').has(key)){
          const max = cache._variables.get('options').max, size = cache._variables.get('lfuqueue').length;
          if(size >= max) {
              // delete the first element in the queue and delete the element in the cache
              const leastFrequent = cache._variables.get('lfuqueue').leastFrequent;
              if(leastFrequent != key) cache.del(leastFrequent).then(() => {
                console.log('Key deleted.', leastFrequent)
              });
          }
          cache._variables.get('lfuqueue').set(key);
        } else {
          cache._variables.get('lfuqueue').set(key);
        }
      });
    });
  }

  policyDel(cache) {
    cache._events.on('del', (key, result) => {
      result.then(res => {
        res && cache._variables.get('lfuqueue').delete(key);
      });

    });
  }

  policyClear(cache) {
    cache._events.on('clear', (result) => {
      result.then(res => {
        res && cache._variables.get('lfuqueue').clear();
      });
    });
  }
}
