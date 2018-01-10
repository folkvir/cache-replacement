# cache-replacement

![Keep Calm and Clear Cache](./src/utils/images/kccc.png)

Do you want a specific in-memory cache ? With a specific replacement policy ? This is the right place.

By default we implemented some replacement policies:
* **FIFO**: First In First Out, the first value cached is replaced. (O(1))
* **LIFO**: Last In First Out, the last value cached is replaced. (O(1))
* **LRU**: Last Recently Used, the last recently used value cached is replaced. (O(1))
* **LFU**: Least Frequently Used, the least frequently used value is replaced (O(1) for DEL, GET, leastFrequent and mostFrequent, and O(log N) for SET)
* **MRU**: Most Recently Used, The most recently used value is replaced. (O(1))
* **MFU**: Most Frequently Used, the most frequently used calue is replaced. (O(1) then O(log N), same as LFU)
* **RR**: Random Replacement in the cache;


## Install
`npm install --save cache-replacement`

## Usage

```js

const CacheReplacementPolicy = require('cache-replacement');

// want a LRU or a LFU ?
const lru = new CacheReplacementPolicy.lru();
const lfu = new CacheReplacementPolicy.lfu();

// Then use it like this, we extends all our cache from node-cache
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

## Test our library
```bash
git clone https://github.com/folkvir/cache-replacement.js
npm install
npm test
```
