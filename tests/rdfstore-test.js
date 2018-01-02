const assert = require('assert');
const RdfStore = require('../src/default-cache/rdfstore.js');

const quads = [
  "<http://example/book2> ns:price 42",
  "<http://example/book2> dc:title \"David Copperfield\"",
  "<http://example/book2> dc:creator \"Edmund Wells\""
]

describe('RDFSTORE AS A CACHE', function() {
  it('Create the RDF store', function() {
    let store = new RdfStore();
    assert.notEqual(store.store, undefined);
  });
  it('INSERT/HAS/GET of unique ?x ?y ?z values', async function() {
    let store = new RdfStore();
    let i = 0;
    for(let q of quads){
      i++;
      try {
        const set = await store.set(q, q);
        assert.equal(set, true, 'The value has to be inserted in the store.')
        const has = await store.has(q);
        assert.equal(has, true, 'The value has to be in the store.')  
        const get = await store.get("?subject ?predicate ?object");
        assert.equal(get.length, i, 'The value has to be the same as: '+q);
      } catch (error) {
        throw error;
      }
    }
  });

});