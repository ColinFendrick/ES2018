const collection = {
  a: 10, b: 20, c: 30,
  [Symbol.asyncIterator]() {
    const values = Object.keys(this)
    let i = 0
    return {
      next: () => {
        return Promise.resolve({
          value: this[values[i++]],
          done: i > values.length
        })
      }
    }
  }
}

const iterator = collection[Symbol.asyncIterator]

console.log(iterator.next().then(res => console.log(res)))