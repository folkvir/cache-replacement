const assert = require('assert');
const RdfStore = require('../src/default-cache/rdfstore.js');

let triples = [
  { subject: "<http://example/book1>", predicate: "<http://example.org/ns/price>", object: "42" },
  { subject: "<http://example/book1>", predicate: "<http://purl.org/dc/elements/1.1/title>", object: "\"A new book\"" },
  { subject: "<http://example/book1>", predicate: "<http://purl.org/dc/elements/1.1/creator>", object: "\"A.N.Other\"" }
];

describe('RDFSTORE AS A CACHE', function() {
  it('Create the RDF store', async function() {
    let store = new RdfStore();
    await store.create();
    assert.notEqual(store.store, undefined);
  });
  it('INSERT triple', async function() {
    let store = new RdfStore();
    await store.create();
    const set = await store.set(triples[0], triples[0]);
    assert.equal(set, true);
    assert.equal(await store.size(), 1);
  });
  it('INSERT 1 duplicated triple', async function() {
    let store = new RdfStore();
    await store.create();
    let set = await store.set(triples[0], triples[0]);
    assert.equal(set, true);
    set = await store.set(triples[0], triples[0]);
    assert.equal(set, false);
    assert.equal(await store.size(), 1);
  });
  it('INSERT Multiple triples', async function() {
    let store = new RdfStore();
    await store.create();
    let set = await store.set(triples[0], triples[0]);
    assert.equal(set, true);
    set = await store.set(triples[1]);
    assert.equal(set, true);
    set = await store.set(triples[2]);
    assert.equal(set, true);
    assert.equal(await store.size(), 3);
  });
  it('INSERT/HAS', async function() {
    let store = new RdfStore();
    await store.create();
    const set = await store.set(triples[0], triples[0]);
    assert.equal(set, true);
    assert.equal(await store.size(), 1);
    const has = await store.has(triples[0]);
    assert.equal(has, true);
    const has2 = await store.has(triples[1]);
    assert.equal(has2, false);
  });
  it('INSERT/DELETE', async function() {
    let store = new RdfStore();
    await store.create();
    const set = await store.set(triples[0], triples[0]);
    assert.equal(set, true);
    assert.equal(await store.size(), 1);
    const has = await store.has(triples[0]);
    assert.equal(has, true);
    const del = await store.del(triples[0]);
    assert.equal(del, true);
    const del2 = await store.del(triples[1]);
    assert.equal(del2, false);
    assert.equal(await store.size(), 0);
  });

  it('INSERT/GET, need to get all matching triples given a triple pattern', async function() {
    let store = new RdfStore();
    await store.create();
    let set = await store.set(triples[0], triples[0]);
    assert.equal(set, true);
    set = await store.set(triples[1]);
    assert.equal(set, true);
    set = await store.set(triples[2]);
    assert.equal(set, true);
    assert.equal(await store.size(), 3);
    let node = store.freshTriple;
    node.subject = "?s"
    node.predicate = "?p";
    node.object = "?o";
    const get = await store.get(node); // spo query in our triple store
    assert.equal(get.length, 3);
  });
});
