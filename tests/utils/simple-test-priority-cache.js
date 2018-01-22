const WeightedCache = require('../../src/utils/priority-cache')
const assert = require('assert')

const cache = new WeightedCache()

const grandom = () => {
  return { value: Math.random() }
}

const r = grandom()
cache.set('a', r)
assert.equal(cache.get('a').value, r.value)

const r2 = grandom()
cache.set('b', r2)
assert.equal(cache.get('b').value, r2.value)

assert.equal(cache.leastFrequent.key, 'a')
assert.equal(cache.mostFrequent.key, 'b')
assert.equal(cache.lastRecentlyUsed.key, 'a')
assert.equal(cache.mostRecentlyUsed.key, 'b')
console.log(cache._nodes.get('a'))
console.log(cache._nodes.get('b'))
assert.equal(cache.getPriority('a'), 2)
assert.equal(cache.getPriority('b'), 2)

cache.delete('b')
assert.equal(cache.leastFrequent.key, 'a')
assert.equal(cache.mostFrequent.key, 'a')
assert.equal(cache.lastRecentlyUsed.key, 'a')
assert.equal(cache.mostRecentlyUsed.key, 'a')
assert.equal(cache.getPriority('a'), 2)
assert.equal(cache.getPriority('b'), false)

cache.delete('a')
assert.equal(cache.leastFrequent, undefined)
assert.equal(cache.mostFrequent, undefined)
assert.equal(cache.lastRecentlyUsed, undefined)
assert.equal(cache.mostRecentlyUsed, undefined)
assert.equal(cache.getPriority('a'), false)
assert.equal(cache.getPriority('b'), false)
