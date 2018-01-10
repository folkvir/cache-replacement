const Cache = require('../../cache-replacement').lfu;
const assert = require('assert');

const ENABLE_PRINT = false;

const print = (cache) => {
  if(ENABLE_PRINT) {
    console.log('Print the lfu queue: ');
    cache.keys.forEach(function(val, node) {
      console.log(`** ${val}`);
    });
  }
};

describe('Testing the LFU policy', function() {
  it('should return undefined when no element in the cache',  function() {
    let cache = new Cache();
    assert.deepEqual(  cache.get('titi'), undefined);
  });
  it('should return true when adding a not exeisting element',  function() {
    let cache = new Cache();
    assert.deepEqual( cache.set('titi', 42), true);
  });
  it('should return 42 when retreiving an existing element',  function() {
    let cache = new Cache();
    const r =  cache.set('titi', 42);
    assert.deepEqual(r, true);
    const r1 =  cache.get('titi');
    assert.deepEqual(r1, 42);
  });
  it('should set the second element correctly (cache size = 1)',  function() {
    let cache = new Cache({max:1});
    const r =  cache.set('titi', 42);
    const r1 =  cache.set('toto', 43);
    const r2 =  cache.get('titi')
    const r3 =  cache.get('toto')
    assert.deepEqual(r2, undefined)
    assert.deepEqual(r3, 43)
    assert.deepEqual( cache.size(), 1);
  });
  it('should re-set the same variable correctly instead of deleting it (cache size = 1)',  function() {
    let cache = new Cache({max:1});
    const r =  cache.set('titi', 42);
    const r1 =  cache.set('titi', 43);
    const r2 =  cache.get('titi')
    assert.deepEqual(r2, 43);
    assert.deepEqual( cache.size(), 1);
  });
  it('should correctly delete the least frequently used element [method get] (cache size =2)',  function() {
    let cache = new Cache({max:2});
    const r =  cache.set('titi', 42);
    print(cache);
    const r1 =  cache.set('toto', 43);
    print(cache);
    assert.equal(cache.keys.leastFrequent, 'titi', 'least frequent titi')
    const r2 =  cache.get('titi');
    print(cache);
    assert.equal(cache.keys.leastFrequent, 'toto', 'least frequent toto')
    const r3 =  cache.set('tata', 44);
    print(cache);
    assert.equal(cache.keys.leastFrequent, 'tata', 'least frequent tata')
    assert.equal(cache.keys.mostFrequent, 'titi' , 'most frequent titi')
    assert.deepEqual( cache.size(), 2);
    assert.deepEqual(cache.keys.length, 2);
  });
  it('should correctly delete the least frequently used element [method has] (cache size =2)',  function() {
    let cache = new Cache({max:2});
    const r =  cache.set('titi', 42);
    const r1 =  cache.set('toto', 43);
    assert.equal(cache.keys.leastFrequent, 'titi', 'least frequent titi')
    const r2 =  cache.has('titi');
    assert.equal(cache.keys.leastFrequent, 'toto', 'least frequent toto')
    const r3 =  cache.set('tata', 44);
    assert.equal(cache.keys.leastFrequent, 'tata', 'least frequent tata')
    assert.equal(cache.keys.mostFrequent, 'titi' , 'most frequent titi')
    assert.deepEqual( cache.size(), 2);
    assert.deepEqual(cache.keys.length, 2);
  });
  it('should correctly delete the least frequently used element [method set] (cache size =3)',  function() {
    let cache = new Cache({max:3});
    const r =  cache.set('titi', 42);
    print(cache);
    assert.deepEqual(cache.keys.leastFrequent, 'titi');
    const r1 =  cache.set('toto', 43);
    print(cache);
    assert.deepEqual(cache.keys.leastFrequent, 'titi');
    assert.equal(r1, true);
    const r2 =  cache.set('titi', 56);
    print(cache);
    assert.deepEqual(cache.keys.leastFrequent, 'toto');
    const r3 =  cache.set('tata', 44);
    assert.equal(r3, true);
    print(cache);
    assert.deepEqual(cache.keys.leastFrequent, 'toto');
    assert.deepEqual(cache.keys.mostFrequent, 'titi');
     cache.set('tutu', "Qu'est-ce qu'un élémentaire de fromage ? un emmental !");

    assert.deepEqual(cache.keys.leastFrequent, 'tata');
    assert.deepEqual(cache.keys.mostFrequent, 'titi');

     cache.set('tutu', "Qu'est-ce qu'un élémentaire de fromage ? un emmental !");
     cache.set('tutu', "Qu'est-ce qu'un élémentaire de fromage ? un emmental !");

    assert.deepEqual(cache.keys.leastFrequent, 'tata');
    assert.deepEqual(cache.keys.mostFrequent, 'tutu');
    assert.deepEqual( cache.size(), 3);
  });
});
