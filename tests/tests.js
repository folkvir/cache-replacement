// cause of clear and size method and has method not implemented in node-cache we use a wrapper to it see (/default-cache/node-cache.js)
const Cache = require('./../src/default-cache/node-cache.js');
const CacheReplacementPolicy = require('./../src/main.js');

let c = new Cache();
console.log(c.set('null', 42), c.get('null'), c.has('null'), c.clear());

// define replacement policy
let cr = new CacheReplacementPolicy();

let cache = cr.createCache(Cache);
cr.setPolicy('fifo', cache);

// tests all methods
console.log('Get; ', cache.get('null'))
console.log('Set; ', cache.set('null', 42))
console.log('Del; ', cache.del('null'))

// console.log('Has; ', cache.has)
console.log('Clear; ', cache.clear())

// tests the cache with our replacement policy
const set = cache.set('uuid', 42);
const get = cache.get('uuid');
const del = cache.del('uuid');
const getafterdel = cache.get('uuid');

console.log(`set: ${set}, get: ${get}, del: ${del}, getafterdel: ${getafterdel}`);





// ca.definePolicy('get', (...args) => {
//   console.log(`get method was triggered: `,...args);
// })
// ca.definePolicy('set', (...args) => {
//   console.log(`set method was triggered: `, ...args);
// })
// ca.definePolicy('del', (...args) => {
//   console.log(`del method was triggered: `,...args);
// })
//
