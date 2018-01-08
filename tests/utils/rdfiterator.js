const BI = require('asynciterator').BufferedIterator;

const array = [1, 2, 3, 4];

function _read(c, d){
  d();
}

let bi = new BI();
bi._read = _read;

bi.on('data', function (number) { console.log('number', number); });
bi.on('end',  function () { console.log('all done!'); });


while(array.length > 0){
  bi._push(array.pop());
}
bi.close();