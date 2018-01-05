const main = require('./src/main.js');
const defaultCache = require('./src/default-cache/node-cache.js')
const RdfStore = require('./src/default-cache/rdfstore.js')

module.exports = {
  main,
  cache: defaultCache,
  rdfstore: RdfStore
}
