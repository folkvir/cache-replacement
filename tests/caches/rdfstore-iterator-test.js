const RdfStore = require('../../src/default-cache/rdfstore-w-iterator');
const BI = require('asynciterator').BufferedIterator;
const assert = require('assert');
const fs = require('fs');;
const delay = require('../../src/utils/delay.js');

let triple = (s, p, o) => {
    return {
      subject: s,
      predicate: p,
      object: o,
      toString: function () {
        return this.subject + ' ' + this.predicate + ' ' + this.object + ' . ';
      },
    };
}



describe('RDFSTORE AS A CACHE USING ITERATORS', function() {
  it('should return no error during setting an iterator in the cache and inserting items in the iterator still opened', function (done){
    let cache = new RdfStore();
    let bi1 = new BI();
    let key1 = JSON.stringify(triple('?s', '?p', '?o'));
    cache.set(key1, bi1);
    bi1._push(triple('http://example/book1', 'ns:price', '"42"^^http://www.w3.org/2001/XMLSchema#integer'))
    bi1._push(triple('http://example/book2', 'ns:price', '"50"^^http://www.w3.org/2001/XMLSchema#integer'))
    bi1.close()

    let bi2 = cache.get(key1);
    let item = 0;
    bi2.on('data', (data) => {
      item++;
    })
    bi2.on('end', () => {
      assert.equal(item, 2);
      done();
    })
  });
  it('should return no error during setting an iterator in the cache after inserted items', async function (){
    let cache = new RdfStore();
    let bi1 = new BI();
    let key1 = JSON.stringify(triple('?s', '?p', '?o'));
    cache.set(key1, bi1);
    bi1._push(triple('http://example/book1', 'ns:price', '"42"^^http://www.w3.org/2001/XMLSchema#integer'))
    bi1._push(triple('http://example/book2', 'ns:price', '"50"^^http://www.w3.org/2001/XMLSchema#integer'))
    bi1.close()

    await delay(500);

    let bi2 = cache.get(key1);
    let item = 0;
    bi2.on('data', (data) => {
      item++;
    })
    bi2.on('end', () => {
      assert.equal(item, 2);
    })
  });
});
