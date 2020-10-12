# cache-replacement

![Keep Calm and Clear Cache](./src/utils/images/kccc.png)

Do you want a specific in-memory cache with get access in O(1) ? With a specific replacement policy ? This is the right place.

**Motivation:** Provide fast access (get in O(1)) to data with a specific replacement policy

By default we implemented some replacement policies:
* **FIFO**: First In First Out, the first value cached is replaced.
* **LIFO**: Last In First Out, the last value cached is replaced.
* **LRU**: Last Recently Used, the last recently used value cached is replaced.
* **LFU**: Least Frequently Used, the least frequently used value is replaced
* **MRU**: Most Recently Used, The most recently used value is replaced.
* **MFU**: Most Frequently Used, the most frequently used value is replaced.
* **RR**: Random Replacement in the cache.

**Complexity in the worst case (best case is almost always O(1)):**

Policy/Method | set | get | has | delete | Key Management | Data Management
--- | --- | --- | --- | --- | --- | ---
FIFO | O(1) | O(1) | O(1) | O(1) | Map + Double Linked List | `memory-cache`
LIFO | O(1) | O(1) | O(1) | O(1) | Map + Double Linked List | `memory-cache`
LRU | O(1) | O(1) | O(1) | O(1) | Map + Double Linked List | `memory-cache`
MRU | O(1) | O(1) | O(1) | O(1) | Map + Double Linked List | `memory-cache`
LFU | O(1) | O(1) | O(1) | O(1) | Map + 2 Double Linked List | *local*
MFU | O(1) | O(1) | O(1) | O(1) | Map + 2 Double Linked List | *local*
RR | O(N) | O(1) | O(1) | O(N) | Array + Map(key, index) |  `memory-cache`

Key Management datastructure only use keys to do their jobs.
For LFU/MFU the Map also stores the value

## Install
`npm install --save cache-replacement`

## Usage

```js

const CacheReplacementPolicy = require('cache-replacement');

// want a LRU or a LFU ?
const lru = new CacheReplacementPolicy.lru();
const lfu = new CacheReplacementPolicy.lfu();

// Then use it like this, we extends all our cache from the same api
```

## API


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
  delete(key) {
    throw new Error('Del method not implemented.');
  }

  /**
   * Get the size of the cache
   * @return {Number}
   */
  size() {
    throw new Error('Size method not implemented');
  }

  /**
   * Iterate on all element
   * @param  {Function} fn a callback returning (k, v) couple
   * @return {void}
   */
  forEach (fn) {
    throw new Error('Size method not implemented');
  }
}
```

## Tests
```bash
git clone https://github.com/folkvir/cache-replacement.js
npm install
npm test
```
