const main = require('./src/main.js');
const defaultCache = require('./src/default-cache/node-cache.js')
const RdfStoreWIterator = require('./src/default-cache/rdfstore-w-iterator.js')

module.exports = {
  main,
  cache: defaultCache
  RdfstoreWithIterator: RdfStoreWIterator
}
