const collection = {
  a: 10, b: 20, c: 30,
  [Symbol.iterator]: function* () {
    for (let key in this) {
      yield this[key]
    }
  }
}

const iterator = collection[Symbol.iterator]()
console.log(iterator.next()) // → { value: 10, done: false }
console.log(iterator.next()) // → { value: 20, done: false }
console.log(iterator.next()) // → { value: 30, done: false }
console.log(iterator.next()) // → { value: undefined, done: true }