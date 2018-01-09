const N3Parser = require('n3').Parser();
const N3Utils = require('n3').Util;
const debug = require('debug')('n3parser');
const RdfString = require('rdf-string');
const RdfDataModel = require('rdf-data-model');

async function parseString(string) {
  debug('Parsing: ', string, '...');
  if(typeof string != 'string') return Promise.reject(new Error('need to be a ttl string: eg: "<a> <b> "c" ." '));

  function parse (ttl) {
    return new Promise((resolve, reject) => {
      const triples = {
        triples: [],
        prefixes: []
      };
      N3Parser.parse(ttl, function (error, tr, prefixes) {
        if (tr) {
          const parsedTriple = {};
          parsedTriple.subject = tr.subject;
          parsedTriple.predicate = tr.predicate;
          parsedTriple.object = tr.object;
          triples.triples.push(parsedTriple);
        } else {
          resolve(triples)
        }
      }, function (prefixName, prefixValue) {
        triples.prefixes.push({ name: prefixName, value: prefixValue } );
      });
    })
  }

  return parse(string);
}

async function ttlTriple2Parsedtriple(triple, prefix = []) {
  // debug('Transforming triple to a valid rdfstore triple...', triple, prefix);
  if(!isTriple(triple)) throw new Error('need to be a triple. {subject, predicate, object}')
  try {
    if(prefix.length > 0) {
      // replace all prefix found by the prefix URI
      prefix.forEach(p => {
        const pref = {};
        pref[p.name] = p.value;
        triple.subject = N3Utils.expandPrefixedName(triple.subject, pref);
        triple.predicate = N3Utils.expandPrefixedName(triple.predicate, pref);
        triple.object = N3Utils.expandPrefixedName(triple.object, pref);
      })
    }
    let ttl = '';
    prefix.forEach(p => {
      ttl += `@prefix ${p.name}:  ${p.value} . `;
    })
    const tripleWellformed = await parseString(ttl+ ` ${triple.subject} ${triple.predicate} ${triple.object} .`)
    triple.subject = tripleWellformed.triples[0].subject
    triple.predicate = tripleWellformed.triples[0].predicate
    triple.object = tripleWellformed.triples[0].object
    debug('Transforming triple to a valid rdfstore triple [finished]...', triple);
    return triple;
  } catch (e) {
    console.warn(e);
    return Promise.reject(e);
  }
}


function fromTripleToRDF(triple, prefix = []) {
  if(!isTriple(triple)) throw new Error('need to be a triple. {subject, predicate, object}')
  if(prefix.length > 0) {
    // replace all prefix found by the prefix URI
    prefix.forEach(p => {
      const pref = {};
      pref[p.name] = p.value;
      triple.subject = N3Utils.expandPrefixedName(triple.subject, pref);
      triple.predicate = N3Utils.expandPrefixedName(triple.predicate, pref);
      triple.object = N3Utils.expandPrefixedName(triple.object, pref);
    })
  }
  triple.subject = convertEntityRdfstore(triple.subject)
  triple.predicate = convertEntityRdfstore(triple.predicate)
  triple.object = convertEntityRdfstore(triple.object)
  return triple;
}

function fromRdfstoreTriple2Triple (rdfstoretriple) {
  if(!isTriple(rdfstoretriple)) throw new Error('need to be a triple. {subject, predicate, object}')
  return {
    subject: rdfstoretriple.subject.toNT(),
    predicate: rdfstoretriple.predicate.toNT(),
    object: rdfstoretriple.object.toNT()
  }
}

/**
 * Verify if an object is a triple
 * Eg: let triples = [
   { subject: "<http://example/book1>", predicate: "<http://example.org/ns/price>", object: "42" },
   { subject: "<http://example/book1>", predicate: "<http://purl.org/dc/elements/1.1/title>", object: "\"A new book\"" },
   { subject: "<http://example/book1>", predicate: "<http://purl.org/dc/elements/1.1/creator>", object: "\"A.N.Other\"" }
 ];
 * triples.map(t => isTriple(t)) // return [true, true, true]
 * @param  {[type]}  value [description]
 * @return {Boolean}       [description]
 */
function isTriple(value) {
  return (value.subject && value.predicate && value.object || value.subject==='' && value.predicate==='' && value.object === '')?true:false;
}


function convertEntityRdfstore(entity) {
  switch (entity[0]) {
      case '"': {
          if(entity.indexOf("^^") > 0) {
              var parts = entity.split("^^");
              return parts[0] + "^^<" + parts[1] + ">";
          } else {
              return entity
          }
      }
      case '_': return entity.replace('b', '');
      default:  return `<${entity}>`;
  }
}

module.exports = {
  parseString,
  isTriple,
  ttlTriple2Parsedtriple,
  fromTripleToRDF,
  fromRdfstoreTriple2Triple
}
