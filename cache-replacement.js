const main = require('./src/main.js');
const fifo = require('./src/policies/fifo.js')

module.exports = { main, FIFO: fifo }
