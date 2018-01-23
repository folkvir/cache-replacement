# cache-replacement

![Keep Calm and Clear Cache](./src/utils/images/kccc.png)

Do you want a specific in-memory cache ? With a specific replacement policy ? This is the right place.

By default we implemented some replacement policies:
* **FIFO**: First In First Out, the first value cached is replaced.
* **LIFO**: Last In First Out, the last value cached is replaced.
* **LRU**: Last Recently Used, the last recently used value cached is replaced.
* **LFU**: Least Frequently Used, the least frequently used value is replaced
* **MRU**: Most Recently Used, The most recently used value is replaced.
* **MFU**: Most Frequently Used, the most frequently used calue is replaced.
* **RR**: Random Replacement in the cache.

**Complexity:**

Policy/Method | set | get | has | delete |
--- | --- | --- | --- | ---
FIFO | O(1) | O(1) | O(1) | O(1)
LIFO | O(1) | O(1) | O(1) | O(1)
LRU | O(1) | O(1) | O(1) | O(1)
MRU | O(1) | O(1) | O(1) | O(1)
LFU | O(1) | O(1) | O(1) | O(1)
MFU | O(1) | O(1) | O(1) | O(1)
RR | O(1) | O(1) | O(1) | O(1)



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
}
```

## Tests
```bash
git clone https://github.com/folkvir/cache-replacement.js
npm install
npm test
```

## Specific tests (for LFU, MFU) (see [issue](https://github.com/folkvir/cache-replacement/issues/1))

For a test case with 100 000 000 distincts elements using our Priority cache (0(1) access)

use: `node --max_old_space_size=4096 tests/utils/heavy-priority-cache.js`

Tested on a **16gb memory machine with an Intel® Core™ i7-4790S CPU @ 3.20GHz × 8, 64bits ubuntu 14.04**

Results for `--max_old_space_size=4096`:

Size | Time (ms) | Memory Usage (MB)
--- | --- | ---
10 000 | 17 | 26.82
100 000 | 147 | 82.72
1 000 000 | 1064 | 355.17
10 000 000 | 38022 | 3141.2
100 000 000 | Heap out of memory | Heap out of memory

Results without `--max_old_space_size=4096`, i.e. standard:

Size | Time (ms) | Memory Usage (MB)
--- | --- | ---
10 000 | 17 | 26.82
100 000 | 157 | 83.68
1 000 000 | 1266 | 341.17
10 000 000 | Heap out of memory | Heap out of memory
100 000 000 | Heap out of memory | Heap out of memory
