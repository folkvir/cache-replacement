const fifo = require('./src/policies/fifo.js');
const lifo = require('./src/policies/lifo.js');
const lru = require('./src/policies/lru.js');
const lfu = require('./src/policies/lfu.js');
const mru = require('./src/policies/mru.js');
const mfu = require('./src/policies/mfu.js');

module.exports = {
  fifo,
  lifo,
  lru,
  lfu,
  mfu,
  mru
}
