const assert = require('assert');
const utils = require('../../src/utils/n3parser.js');
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

describe('N3PARSER', function() {
  it('Parsing a triple to a quad.', async function (){
    const parsed = utils.fromTripleToRDF({
      subject: 'http://example/book1',
      predicate: 'http://example.org/ns#price',
      object: '"42"^^http://www.w3.org/2001/XMLSchema#integer'
    })
    assert.equal(parsed.subject, '<http://example/book1>')
    assert.equal(parsed.predicate, '<http://example.org/ns#price>')
    assert.equal(parsed.object, '"42"^^<http://www.w3.org/2001/XMLSchema#integer>')
  });
});
