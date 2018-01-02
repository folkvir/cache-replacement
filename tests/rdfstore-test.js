const assert = require('assert');
const RdfStore = require('../src/default-cache/rdfstore.js');

const quads = [
  "<http://example/book2> ns:price 42",
  "<http://example/book2> dc:title \"David Copperfield\"",
  "<http://example/book2> dc:creator \"Edmund Wells\""
]

describe('Behavior', function() {
  it('Create the RDF store', function() {
    let store = new RdfStore();
    assert.notEqual(store.store, undefined);
  });
  it('INSERT', function() {
    let store = new RdfStore();
    store.set(quads[0], quads[0]);
    // quads.forEach(q => {
    //   store.set(q, q);
    // })
  });

});