const Cache = require('../../cache-replacement').lru
const assert = require('assert')

const ENABLE_PRINT = false

const print = (cache) => {
  if (ENABLE_PRINT) {
    console.log('Print the lru queue: ')
    cache.keys.forEach(function (val, node) {
      console.log(`** ${val}`)
    })
  }
}

describe('Testing the LRU policy', function () {
  it('should return undefined when no element in the cache', function () {
    let cache = new Cache()
    const g = cache.get('titi')
    assert.deepEqual(g, undefined)
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
    assert.deepEqual(cache.size(), 1)
  })
  it('should re-set the same variable correctly instead of deleting it (cache size = 1)', function () {
    let cache = new Cache({max: 1})
    cache.set('titi', 42)
    cache.set('titi', 43)
    const r2 = cache.get('titi')
    assert.deepEqual(r2, 43)
    assert.deepEqual(cache.size(), 1)
  })
  it('should correctly delete the least recently used element [method get] (cache size =2)', function () {
    let cache = new Cache({max: 2})
    cache.set('titi', 42)
    cache.set('toto', 43)
    cache.get('titi')
    cache.set('tata', 44)
    const r4 = cache.get('toto')
    assert.deepEqual(r4, undefined)
    assert.deepEqual(cache.size(), 2)
  })
  it('should not increase frequency with method has (cache size =2)', function () {
    let cache = new Cache({max: 2})
    cache.set('titi', 42)
    cache.set('toto', 43)
    const r2 = cache.has('titi')
    cache.set('tata', 44)
    const r4 = cache.get('titi')
    assert.deepEqual(r2, true)
    assert.deepEqual(r4, undefined)
    assert.deepEqual(cache.size(), 2)
  })
  it('should correctly delete the least recently used element [method set] (cache size =3)', function () {
    let cache = new Cache({max: 3})
    cache.set('titi', 42)
    print(cache)
    assert.deepEqual(cache._keys.last(), 'titi')
    const r1 = cache.set('toto', 43)
    print(cache)
    assert.deepEqual(cache._keys.last(), 'toto')
    assert.equal(r1, true)
    const r2 = cache.set('titi', 56)
    print(cache)
    assert.deepEqual(cache._keys.last(), 'titi')
    assert.deepEqual(cache._keys.first(), 'toto')
    assert.equal(r2, true)
    const r3 = cache.set('tata', 44)
    assert.equal(r3, true)
    print(cache)
    assert.deepEqual(cache._keys.last(), 'tata')
    assert.deepEqual(cache._keys.first(), 'toto')
    cache.set('tutu', "Qu'est-ce qu'un élémentaire de fromage ? un emmental !")
    // now we have toto => titi => tata => tutu
    print(cache)
    assert.deepEqual(cache._keys.last(), 'tutu')
    assert.deepEqual(cache._keys.first(), 'titi')
    // now we have toto => titi => tata => tutu
    print(cache)
    const r5 = cache.get('titi')
    assert.deepEqual(r5, 56)
    // now we have toto => tata => tutu => titi
    assert.deepEqual(cache._keys.last(), 'titi')
    assert.deepEqual(cache._keys.first(), 'tata')
    assert.deepEqual(cache.size(), 3)
  })
  it('should correctly call foreach', function () {
    let cache = new Cache()
    cache.set('toto')
    cache.forEach((v, k) => {
      assert.equal(k, 'toto')
    })
  })
  it('should correctly react with 1000 elements in [1, 10]', function (done) {
    this.timeout(50000)
    const maxi = 1000
    const maxKey = 10
    function pick () {
      return Math.floor(Math.random() * maxKey + 1)
    }
    let list = new Cache({max: maxKey})
    for (let i = 0; i < maxi; ++i) {
      const p = pick()
      if (list.has(p)) {
        list.get(p)
      } else {
        list.set(p, p)
      }
    }
    assert.equal(list.size(), maxKey)
    done()
  })

  it('should correctly react in async mode', function (done) {
    this.timeout(5000)
    async function insert (repeat, cache, event, limit) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // console.log('Size of the cache before the loop: ', cache.size())
          for (let i = 0; i < repeat; i++) {
            cache.set(i, i)
            assert.equal(cache.size(), limit)
          }
          event.emit('end')
        }, Math.random() * 500)
      })
    }

    const limit = 5
    const end = 100
    const repeat = 80
    let event = new (require('events'))()
    let res = 0
    event.on('end', () => {
      res++
      if (res === end) done()
    })
    var cache = new Cache({max: limit})
    for (let i = 0; i < 5; i++) cache.set(i, i)
    for (let i = 0; i < end; i++) insert(repeat, cache, event, limit)
  })
})
