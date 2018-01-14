const pmdll = require('../../src/utils/pmdll')
const sample = require('lodash.sample');

const cache = new pmdll();

const item = [ 1, 2, 3, 4 ]


const iteration = parseInt(process.argv[2]);

for(let i = 0; i<iteration; ++i){
  cache.set(i);
}