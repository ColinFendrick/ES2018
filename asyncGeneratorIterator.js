const collection = {
  a: 10, b: 20, c: 30,
  [Symbol.asyncIterator]: async function * () {
    for (let key in this) {
  yield this[key]
}
  }
}

const iterator = collection[Symbol.asyncIterator]()

console.log(iterator.next().then(res => console.log(res)))