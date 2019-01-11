# ES2018

## Rest/Spread

*Basic spread*

```
const arr1 = [10, 20, 30]

// make a copy of arr1
const copy = [...arr1]

console.log(copy);    // → [10, 20, 30]

const arr2 = [40, 50]

// merge arr2 with arr1
const merge = [...arr1, ...arr2]

console.log(merge);    // → [10, 20, 30, 40, 50]
```

**NEW** *Spread object literals*

```
const obj1 = {
  a: 10,
  b: 20
}

let obj2 = {
  ...obj1, 
  c: 30
}

console.log(obj2) // → { a: 10, b: 20, c: 30 }

obj2 = {
  ...obj1,
  a: 30
}

console.log(obj2) // → { a: 30, b: 20, c: 30 }
```

Spread does not copy enumerable properties:

```
const car = { color: 'blue' }

Object.defineProperty(car, 'type', { value: 'coupe', enumerable: false })
console.log(car) // → { color: 'blue', type: 'coupe' }
console.log({...car}) // → { color: 'blue' }
```

Inherited properties are ignored in spread
```
const car = { color: 'blue' }

const car2 = Object.create(car, { type: {
    value: 'coupe',
    enumerable: true,
  }
})

console.log(car2.color) // → blue
console.log(car2.hasOwnProperty('color')) // → false
console.log(car2.type) // → coupe
console.log(car2.hasOwnProperty('type')) // → true

console.log(car2) // → { color: 'blue', type: 'coupe' }
console.log({...car2}) // → { color: 'blue' }
```

*Rest*

```
const arr = [10, 20]
const [x, ...restOfArr] = arr

console.log(x) // → 10
console.log(restOfArr) // → [20, 30]
```
**NEW** Can now be applied to objects

```
const obj = {
  a: 10,
  b: 20,
  c: 30
}

const { a, ...restOfObj } = obj
console.log(a) // → 10
console.log(restOfObj) // → { b:20, c: 30 }
```

## Async Iteration

### Iterators
```
const arr = [10, 20, 30]
const iterator = arr[Symbol.iterator]()

console.log(iterator.next()) // → { value: 10, done: false }
console.log(iterator.next()) // → { value: 20, done: false }
console.log(iterator.next()) // → { value: 30, done: false }
console.log(iterator.next()) // → { value: undefined, done: true }
```
### Objects can be defined to be iterable
```
const collection = { a: 10, b: 20, c: 30, 
  [Symbol.iterator]() {
    const values = Object.keys(this)
    let i = 0
    return {
      next: () => {
        value: this[values[i++]]
        done: i > values.length
      }
    }
  }
}
const iterator = collection[Symbol.iterator]()

console.log(iterator.next()) // → { value: 10, done: false }
console.log(iterator.next()) // → { value: 20, done: false }
console.log(iterator.next()) // → { value: 30, done: false }
console.log(iterator.next()) // → { value: undefined, done: true }
```

This can be simplified to using a generator function

```
const collection = { a: 10, b: 20, c: 30, 
  [Symbol.iterator]: function * () {
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
```

This is not suitable for async data sources, so ES2018 gives async iterators.
An async iterator differs from a conventional iterator. Instead of returning a plain object, it returns a promise that fulfills (to the same object as the
normal iterators).
This is written as `Symbol.asyncIterator`.

```
const collection = { a:10, b:20, c: 30,
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

const iterator = collection[Symbol.asyncIterator]()

console.log(iterator.next().then(res => console.log(res)))
```

Can also be simplified using a generator function
```
const collection = { a: 10, b: 20, c: 30
  [Symbol.asyncIterator]: async function * () {
    for (let key in this) {
      yield this[key]
    }
  }
}

const iterator = collection[Symbol.asyncIterator]()

console.log(iterator.next().then(res => console.log(res)))
```

Normally a `for...of` is the way to iterate over an iterable object.
This however does not work with an async iterable. So ES2018 provides the
**NEW** `for...await...of`.
```
const collection = { a: 10, b: 20, c: 30,
  [Symbol.asyncIterator]: async function * () {
    for (let key in this) {
      yield this[key]
    }
  }
}

(async function () {
  for await (const x of collection) {
    console.log(x)
  }
})()
```
This is implicitely calling the asyncIterator on the collection.
## Promise.prototype.finally

Example:
```
fetch('http://www.google.com').then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
}).finally(() => {
  document.querySelector('#spinner').style.display = 'none'
})
```
This allows us to prevent duplicate code, like here where the spinner should hide regardless
of the result of the promise.
