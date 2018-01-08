const Rdfstore = require('../../src/default-cache/rdfstore');
const sync = require('../../src/utils/deasync-promise');

const cache = new Rdfstore();

const data = [
  "<http://example/book1> ns:price 42",
  "<http://example/book1> dc:title \"A new book\"",
  "<http://example/book1> dc:creator \"A.N.Other\""
]

cache.create().then(() => {
  for(let tpq of data){
    const prom = cache.query(`INSERT DATA { ${tpq} }`, cache.store);
    sync(prom);
    console.log('**\n ', sync(cache.query(`CONSTRUCT { ${tpq} } WHERE { ${tpq} }`, cache.store)), '**\n');
  }
  console.log(sync(cache.get({ subject: '?s', predicate:'?p', object:'?o'})));
  
}).catch(e => {
  console.log(e);
})





