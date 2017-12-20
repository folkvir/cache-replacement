# cache-replacement
This is a tool to create your own cache replacement policies.
We wrap the cache (be carefull to fit the API) you want to use and enable a way to custom the replacement policy that fits your need.

By default **FIFO**, **LIFO** are implemented.

* FIFO and LIFO are implemented with a fifo queue (see [fifo](https://www.npmjs.com/package/fifo) npm package)

__Be aware, I do not intend to developp perfect cache replacement policies here
and this tool is not adapt if you want to use a specific cache replacement policy.
Because a cache replacement policy can be completely developp with more adapted specific data structures accorded to their internal policy replacement.__

## Install
`npm install --save cache-replacement`

## Usage

At least you need to install a cache such as [node-cache](https://www.npmjs.com/package/node-cache) `npm install --save node-cache` or use our default cache that is a wrapper of node-cache fitting our API.

```js

const CacheReplacementPolicy = require('cache-replacement').main;
const Cache = require('node-cache') // or require('cache-replacement').cache

// Create the main class
let cacheReplacement = new CacheReplacementPolicy();

// wrap your cache
let cache = cacheReplacement.createCache(Cache, {max: 1});

// set the policy for the specified cache
cacheReplacement.setPolicy('fifo', cache)

const r = cache.set('titi', 42);
const r1 = cache.set('toto', 43);
const r2 = cache.get('titi')
const r3 = cache.get('toto')

assert.deepEqual(r2, undefined)
assert.deepEqual(r3, 43)
assert.deepEqual(cache.size(), 1);

```

## Create your own Policy

First of all, respect the below API for your cache:

```js
class Cache {
  /**
   * Get a value for a given key
   * @param  {String} key
   * @return {Object}
   */
  get(key) {
    throw new Error('Get method not implemented.');
  }

  /**
   * Set a value for a given key
   * @param  {String} key
   * @param {Object} value   [description]
   * @param {Boolean} return true if set or false otherwise
   */
  set(key, value) {
    throw new Error('Set method not implemented. Parameters: (key, value)');
  }

  /**
   * Check if a key is defined in the cache
   * @param  {String}  key
   * @return {Boolean}     true or false
   */
  has(key) {
    throw new Error('Has method not implemented.');
  }

  /**
   * Reset the cache to an empty cache
   * @return {Boolean} true if clear, false otherwise
   */
  clear() {
    throw new Error('Clear method not implemented.');
  }

  /**
   * Delete a given key from the cache
   * @param  {[type]} key
   * @return {Boolean} true if deleted, false otherwise
   */
  del(key) {
    throw new Error('Del method not implemented.');
  }

  /**
   * Get the size of the cache
   * @return {Number}
   */
  size() {
    throw new Error('Size method not implemented');
  }
}
```

Then create your own policy, for example the FIFO policy is implemented like this:

```js
const FIFOQueue = require('fifo');
const debug = require('debug')('fifo');

/**
 * This policy act as a FIFO queue, if a new element is added to the cache and the cache is full then the first element added is deleted.
 * See https://en.wikipedia.org/wiki/Cache_replacement_policies#First_In_First_Out_(FIFO)
 * => All policy events are emitted after the execution of the cache function
 */
module.exports = class FifoPolicy {
  constructor(options) {
    this._methods = ['set', 'del', 'clear'];
  }
  get methods () {
    return this._methods;
  }

  apply(cache) {
    // initialize variable for ou policy
    const options = cache._options[0] === undefined && { max: Infinity } || cache._options[0];
    cache._variables.set('options', options)
    cache._variables.set('fifoqueue', new FIFOQueue())
    this.policySet(cache);
    this.policyDel(cache);
    this.policyClear(cache);
  }

  policySet(cache) {
    cache._events.on('set', (key, value, result) => {
      debug('Calling method set with: ', key, value, result, "... Cache Options: ", cache._variables.get('options'));
      if(result && cache.has(key)){
        const max = cache._variables.get('options').max, size = cache._variables.get('fifoqueue').length;
        if(size >= max) {
          debug('Deleting the first key because max cache length');
          // delete the first element in the queue and delete the element in the cache

          const oldKey = cache._variables.get('fifoqueue').shift();

          if(oldKey !== key) cache.del(oldKey);
        }
        debug('Adding the key to the fifo queue');
        cache._variables.get('fifoqueue').push(key);
        debug(cache._variables.get('fifoqueue'));
      } else {
        // noop, just set the variable in the cache
        debug('Simple behavior');
      }
      debug('fifoqueue size: ', cache._variables.get('fifoqueue').length, ' IsInCache: ', cache.has(key))
    });
  }

  policyDel(cache) {
    cache._events.on('del', (key, result) => {
      debug('Calling method del with: ', key, result, "...");
      if(result && !cache.has(key)) {
        cache._variables.get('fifoqueue').bump(key);
        cache._variables.get('fifoqueue').pop();
      } else if(result && cache.has(key)){
        cache._variables.get('fifoqueue').bump(key);
        cache._variables.get('fifoqueue').pop();
        cache.del(key);
      }
    });
  }

  policyClear(cache) {
    cache._events.on('clear', (result) => {
      debug('Calling method clear with: ', result, "...");
      cache._variables.get('fifoqueue').clear();
    });
  }
}
```

At least you need to define:
* (mandatory) The array of methods representing the methods on which you will listening on events
* (mandatory) a getter to it
* (mandatory) the apply method
  * parameter: cache

```js
module.exports = class FifoPolicy {
  constructor(options) {
    this._methods = ['set', 'del', 'clear'];
  }
  get methods () {
    return this._methods;
  }

  apply(cache) {
    // implement here your own policy
  }
};
```

When we wrap the cache with the method createCache we add some properties in the object such as:
* \_events : an event emitter
  * when you call a method such as get/set/clear/... and event is emitted on the same name 'get', 'set', 'clear'/ etc, after the execution of the cache's function.
* \_variables : is a Map where you can store variables used for your replacement policy such as frequency, size, etc.

For example if you want to create a policy that duplicates all value with a prefixed key you have to listen on the event 'set' for duplicating all values and 'del' for removing all duplicated values (1 delation = 2 delations).

Here is the code
```js
module.exports = class FifoPolicy {
  constructor(options) {
    this._methods = ['set', 'del', 'clear'];
  }
  get methods () {
    return this._methods;
  }

  apply(cache) {
    // implement here your own policy
    cache._events.on('set', (key, value, result) => {
      // add another entry in the cache with our prefix
      if(result) cache.set('my-awesome-key'+key, value);
    })
    cache._events.on('del', (key, result) => {
      // delete the prefixed entry according to its key
      if(result && !key.includes('my-awesome-key')) cache.del('my-awesome-key'+key);
    })
  }
};
```

If you want to store variables use this inside apply method: `cache._variables.set('variableName', valueName)`

** Enjoy our lib ! **

## Test our library
```bash
git clone https://github.com/folkvir/cache-replacement.js
npm install
npm test
```
If you want some debug logs (for example lifo policy) we use the [debug]() package
```bash
DEBUG=lifo npm test
# adapt you code according to your platform
```
