const fifo = require('./src/policies/fifo.js');
const lifo = require('./src/policies/lifo.js');
const lru = require('./src/policies/lru.js');
const lfu = require('./src/policies/lfu.js');
const mru = require('./src/policies/mru.js');
const mfu = require('./src/policies/mfu.js');
const triplestore = require('./src/default-cache/triplestore');
const triplestorewiterator = require('./src/default-cache/triplestore-w-iterator')
const rdfstore = require('./src/default-cache/rdfstore');
const rdfstorewiterator = require('./src/default-cache/rdfstore-w-iterator')
const memorycache = require('./src/default-cache/memory-cache');

module.exports = {
  fifo, lifo,
  lru, lfu,
  mru, mfu,
  memorycache,
  triplestore, triplestorewiterator,
  rdfstore, rdfstorewiterator
}
