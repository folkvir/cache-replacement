const main = require('./src/main.js');
const defaultCache = require('./src/default-cache/node-cache.js')

module.exports = { main, cache: defaultCache }
