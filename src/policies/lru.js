const debug = require('debug')('lru');
const FifoQueue = require('../utils/map-double-linked-list.js');


/**
 * This policy act as a FIFO queue, if a new element is added to the cache and the cache is full then the first element added is deleted.
 * See https://en.wikipedia.org/wiki/Cache_replacement_policies#First_In_First_Out_(FIFO)
 * => All policy events are emitted after the execution of the cache function
 */
module.exports = class FifoPolicy {
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
      debug('Calling method Get with: ', key, result, "... Cache Options: ", cache._variables.get('options'));
      debug('Result of getting key:', key, result);
      if(result) {
        const node = cache._variables.get('lruqueue').find(key);
        cache._variables.get('lruqueue').bump(node);
      }
    });
  }

  policySet(cache) {
    cache._events.on('set', (key, value, result) => {
      debug('Calling method set with: ', key, value, result, "... Cache Options: ", cache._variables.get('options'));
      if(result){
        const max = cache._variables.get('options').max, size = cache._variables.get('lruqueue').length;
        debug('lruqueue size before adding the key : ', size, ' max size: ', max);
        if(size >= max) {
          debug('Deleting the first key because max cache length and least recent key is always the first element');
          // delete the first element in the queue and delete the element in the cache

          const oldKey = cache._variables.get('lruqueue').shift();

          if(oldKey !== key) cache.del(oldKey);
        }
        debug('Adding the key to the lru queue');
        cache._variables.get('lruqueue').push(key);
      } else {
        // // always bump the existing key at the end of the queue, in order to reproduce the LRU cache
        // const node = cache._variables.get('lruqueue').find(key);
        // if(node){
        //   debug('My node:', node);
        //   cache._variables.get('lruqueue').bump(node);
        // } else {
        //   cache._variables.get('lruqueue').push(key);
        // }
      }
      debug('lruqueue size after added the key: ', cache._variables.get('lruqueue').length);
    });
  }

  policyDel(cache) {
    cache._events.on('del', (key, result) => {
      debug('Calling method del with: ', key, result, "...");
      if(result) {
        cache._variables.get('lruqueue').remove(cache._variables.get('lruqueue').find(key));
      }
    });
  }

  policyClear(cache) {
    cache._events.on('clear', (result) => {
      debug('Calling method clear with: ', result, "...");
      cache._variables.get('lruqueue').clear();
    });
  }
}
