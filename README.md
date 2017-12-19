# cache-replacement
This is a tool to create your own cache replacement policies.

```js
const Cache = require('node-cache');
const CacheReplacementPolicy = require('./../src/main.js');


// define replacement policy
let ca = new CacheReplacementPolicy(Cache, {}, { methods: ["set", "get", "del"] });
ca.definePolicy('get', (...args) => {
  console.log(`get method was triggered: `,...args);
})
ca.definePolicy('set', (...args) => {
  console.log(`set method was triggered: `, ...args);
})
ca.definePolicy('del', (...args) => {
  console.log(`del method was triggered: `,...args);
})

// tests the cache with our replacement policy
const set = ca.set('uuid', 42);
const get = ca.get('uuid');
const del = ca.del('uuid');
const getafterdel = ca.get('uuid');

console.log(`set: ${set}, get: ${get}, del: ${del}, getafterdel: ${getafterdel}`);

```

Be aware, I do not intend to developp perfect cache replacement policies here
and this tool is not adapt if you want to use a specific cache replacement policy.
Because a cache replacement policy can be completely developp with more adapted specific data structures accorded to their internal policy replacement.
