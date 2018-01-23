const Cache = require('../../cache-replacement').lfu
const assert = require('assert')

const ENABLE_PRINT = false

const print = (cache) => {
  if (ENABLE_PRINT) {
    console.log('Print the lfu queue: ', `, least: ${cache.leastFrequent} most:${cache.mostFrequent}`)
    cache.keys.forEach(function (val, node) {
      console.log(`** ${val}`)
    })
  }
}

describe('Testing the LFU policy', function () {
  it('should return undefined when no element in the cache', function () {
    let cache = new Cache()
    assert.deepEqual(cache.get('titi'), undefined)
  })
  it('should return true when adding a not exeisting element', function () {
    let cache = new Cache()
    assert.deepEqual(cache.set('titi', 42), true)
  })
  it('should return 42 when retreiving an existing element', function () {
    let cache = new Cache()
    const r = cache.set('titi', 42)
    assert.deepEqual(r, true)
    const r1 = cache.get('titi')
    assert.deepEqual(r1, 42)
  })
  it('should set the second element correctly (cache size = 1)', function () {
    let cache = new Cache({max: 1})
    cache.set('titi', 42)
    cache.set('toto', 43)
    const r2 = cache.get('titi')
    const r3 = cache.get('toto')
    assert.deepEqual(r2, undefined)
    assert.deepEqual(r3, 43)
    assert.deepEqual(cache.size, 1)
  })
  it('should re-set the same variable correctly instead of deleting it (cache size = 1)', function () {
    let cache = new Cache({max: 1})
    cache.set('titi', 42)
    cache.set('titi', 43)
    const r2 = cache.get('titi')
    assert.deepEqual(r2, 43)
    assert.deepEqual(cache.size, 1)
  })
  it('should correctly delete the least frequently used element [method get] (cache size =2)', function () {
    let cache = new Cache({max: 2})
    cache.set('titi', 42)
    print(cache)
    cache.set('toto', 43)
    print(cache)
    assert.equal(cache.leastFrequent.key, 'titi', 'least frequent titi')
    cache.get('titi')
    print(cache)
    assert.equal(cache.leastFrequent.key, 'toto', 'least frequent toto')
    cache.set('tata', 44)
    print(cache)
    assert.equal(cache.leastFrequent.key, 'tata', 'least frequent tata')
    assert.equal(cache.mostFrequent.key, 'titi', 'most frequent titi')
    assert.deepEqual(cache.size, 2)
  })
  it('should not increase frequency with method has (cache size =2)', function () {
    let cache = new Cache({max: 2})
    cache.set('titi', 42)
    cache.set('toto', 43)
    assert.equal(cache.leastFrequent.key, 'titi', 'least frequent toto')
    cache.has('titi')
    assert.equal(cache.leastFrequent.key, 'titi', 'least frequent toto')
    assert.deepEqual(cache.size, 2)
  })
  it('should correctly delete the least frequently used element [method set] (cache size =3)', function () {
    let cache = new Cache({max: 3})
    cache.set('titi', 42)
    assert.deepEqual(cache.leastFrequent.key, 'titi')
    const r1 = cache.set('toto', 43)
    assert.deepEqual(cache.leastFrequent.key, 'titi')
    assert.equal(r1, true)
    cache.set('titi', 56)
    assert.deepEqual(cache.leastFrequent.key, 'toto')
    const r3 = cache.set('tata', 44)
    assert.equal(r3, true)
    assert.deepEqual(cache.leastFrequent.key, 'toto')
    assert.deepEqual(cache.mostFrequent.key, 'tata')
    cache.set('tutu', "Qu'est-ce qu'un élémentaire de fromage ? un emmental !")

    assert.deepEqual(cache.leastFrequent.key, 'titi')
    assert.deepEqual(cache.mostFrequent.key, 'tutu')

    cache.set('tutu', "Qu'est-ce qu'un élémentaire de fromage ? un emmental !")
    cache.set('tutu', "Qu'est-ce qu'un élémentaire de fromage ? un emmental !")
    assert.deepEqual(cache.leastFrequent.key, 'titi')
    assert.deepEqual(cache.mostFrequent.key, 'tutu')
    assert.deepEqual(cache.size, 3)
  })
})
