const RdfStore = require('../../src/default-cache/rdfstore.js');
const utils = require('../../src/utils/n3parser.js');;
const assert = require('assert');
const fs = require('fs');

// !! RDF triples !!
let triples = [];
before(async function() {
  /**
   * As our data is a turtle file
   * We have to firstly parse the data from the turtle representation to a triple representation
   * Then for the RDFStore that uses RDF formats we just convert all value into their RDF Format,
   * EG:
   * @type {Array}
   */
  const file = fs.readFileSync(__dirname+'/../data/data1.ttl', 'utf8');
  triples = (await utils.parseString(file)).triples.map(t => utils.fromTripleToRDF(t));

  console.log('Data:', triples);
});

describe('RDFSTORE AS A CACHE', function() {
  it('Parsing a ttl string', async function (){
    const parsed = await utils.parseString(
      "@prefix ns: <http://example.org/ns#> . "
       + triples[0].subject + " "
       +triples[0].predicate + " "
       + triples[0].object + " . ")
    assert.equal(parsed.prefixes[0].name, 'ns')
    assert.equal(parsed.prefixes[0].value, 'http://example.org/ns#')
    assert.equal(parsed.triples[0].subject, 'http://example/book1')
    assert.equal(parsed.triples[0].predicate, 'http://example.org/ns#price')
    assert.equal(parsed.triples[0].object, '"42"^^http://www.w3.org/2001/XMLSchema#integer')
  });
  it('Use the parsed string in our Rdfstore', async function (){
    const parsed = await utils.parseString(
      "@prefix ns: <http://example.org/ns#> . "
       + triples[0].subject + " "
       +triples[0].predicate + " "
       + triples[0].object + " . ")
    assert.equal(parsed.prefixes[0].name, 'ns')
    assert.equal(parsed.prefixes[0].value, 'http://example.org/ns#')
    assert.equal(parsed.triples[0].subject, 'http://example/book1')
    assert.equal(parsed.triples[0].predicate, 'http://example.org/ns#price')
    assert.equal(parsed.triples[0].object, '"42"^^http://www.w3.org/2001/XMLSchema#integer')
    parsed.triples.map(t => utils.fromTripleToRDF(t, parsed.prefixes))
    assert.equal(parsed.triples[0].subject, '<http://example/book1>')
    assert.equal(parsed.triples[0].predicate, '<http://example.org/ns#price>')
    assert.equal(parsed.triples[0].object, '"42"^^<http://www.w3.org/2001/XMLSchema#integer>')
  });
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
    // get.triples.forEach(t => {
    //   console.log(utils.fromRdfstoreTriple2Triple(t));
    // });
    assert.equal(get.length, 3);

    let node1 = store.freshTriple;
    node1.subject = "?s"
    node1.predicate = "<http://example.org/ns#price>";
    node1.object = "?o";

    let q = await store.get(node1);
    // q.triples.forEach(t => {
    //   console.log(utils.fromRdfstoreTriple2Triple(t));
    // });
  });
});
