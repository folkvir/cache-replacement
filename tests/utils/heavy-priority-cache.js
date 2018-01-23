const WeightedCache = require('../../src/utils/priority-cache')

function xp (max) {
  const time = new Date()
  let list = new WeightedCache()
  for (let i = 0; i < max; ++i) {
    list.set(i, Math.random() * max)
  }

  console.log('List filled. with ', max, ' elements in ', `${(new Date()).getTime() - time.getTime()} (ms)`)

  const used = process.memoryUsage()
  for (let key in used) {
    console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`)
  }
}

xp(10000)
xp(100000)
xp(1000000)
xp(10000000)
// xp(100000000)
