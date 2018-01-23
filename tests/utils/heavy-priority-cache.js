const WeightedCache = require('../../src/utils/priority-cache')

const time = new Date()
const max = 10000000
let list = new WeightedCache()
for (let i = 0; i < max; ++i) {
  list.set(i, Math.random() * max)
}

console.log('List filled. with ', max, ' elements in ', `${(new Date()).getTime() - time.getTime()} (ms)`)

const used = process.memoryUsage()
for (let key in used) {
  console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`)
}
