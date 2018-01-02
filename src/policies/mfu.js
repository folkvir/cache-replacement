const debug = require('debug')('mfu');
const mfuqueue = require('../utils/pmdll.js');

module.exports = class MFUPolicy {
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
    cache._variables.set('mfuqueue', new mfuqueue())
    this.policyGet(cache);
    this.policySet(cache);
    this.policyDel(cache);
    this.policyClear(cache);
  }

  policyGet(cache) {
    cache._events.on('get', (key, result) => {
      result.then((res) => {
        debug('Calling method Get with: ', key, res, "... Cache Options: ", cache._variables.get('options'));
        debug('Result of getting key:', key, res);
        res && cache._variables.get('mfuqueue').set(key);
      });
    });
  }

  policySet(cache) {
    cache._events.on('set', (key, value, result) => {
      result.then((res) => {
        debug('Calling method set with: ', key, value, res, "... Cache Options: ", cache._variables.get('options'));
        if(res && !cache._variables.get('mfuqueue').has(key)){
          const max = cache._variables.get('options').max, size = cache._variables.get('mfuqueue').length;
          debug('mfuqueue size before adding the key : ', size, ' max size: ', max);
          if(size >= max) {
              debug('Deleting the first key because max cache length and least recent key is always the first element');
              // delete the first element in the queue and delete the element in the cache

              const mostFrequent = cache._variables.get('mfuqueue').mostFrequent;
              if(mostFrequent != key) cache.del(mostFrequent);
          }
          debug('Adding the key to the lru queue');
          cache._variables.get('mfuqueue').set(key);
        } else {
          debug('Bump the key at the end of the mfuqueue');
          cache._variables.get('mfuqueue').set(key);
        }
        debug('mfuqueue size after added the key: ', cache._variables.get('mfuqueue').length);
      });
    });
  }

  policyDel(cache) {
    cache._events.on('del', (key, result) => {
      result.then((res) => {
        debug('Calling method del with: ', key, res, "...");
        if(res) {
          cache._variables.get('mfuqueue').delete(key);
        }
      });
    });
  }

  policyClear(cache) {
    cache._events.on('clear', (result) => {
      result.then((res) => {
        debug('Calling method clear with: ', res, "...");
        res && cache._variables.get('mfuqueue').clear();
      });
    });
  }
}
