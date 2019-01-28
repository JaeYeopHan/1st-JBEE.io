---
title: '[ES6] 13. Map, WeakMap'
date: 2017-06-05 14:44:56
category: 'javascript'
---

![](/images/javascript_es6.png)

# [ES6] 13. Map, WeakMap API

## Map Object

아시다시피, `Map`오브젝트는 key-value의 자료구조입니다. 기존 자바스크립트의 Object도 마찬가지로 key-value형식으로 구성되는데요, `Map`오브젝트는 `key`로 사용될 수 있는 타입이 다양하다는 것이 다른 점이라고 할 수 있습니다. 또한 `Map`오브젝트는 Object 오브젝트와는 달리 `이터러블 오브젝트`입니다. 그렇기 때문에 `for-of` statement를 사용하여 순회할 수 있습니다.

`Map`오브젝트는 새로 추가되는 값의 `key`와 기존에 저장되어 있던 데이터의 `key`의 값이 동일하면 추가되지 않습니다. Java에서의 Map은 key를 hash값으로 저장하기 때문에 동일한 hash 값에 대해서 추가하지 않는데요, JavaScript에서는 조금 다른 방식으로 이를 판단합니다. key와 value가 저장될 때, 엔진이 별도의 일련 번호를 부여하여 이를 판단하게 됩니다. 또한 이 일련번호로 추가된 순서를 보장해줍니다.

##### 다음과 같이 정리할 수 있겠습니다.

- 다양한 타입으로 `key`를 정의할 수 있다.
- 이터러블 오브젝트(iterable object)이다.
- 중복된 `key`를 추가할 수 없다.
- 중복된 `key`를 통해 추가하는 경우 해당 `key`의 `value`를 덮어쓴다.
  - 즉 기존 `key`의 순서를 유지한다.
- 순서를 보장하는 자료구조이다.

#### Notice

예제 코드의 길이을 줄이기 위해 `Map`의 key와 value를 확인하기 위한 함수를 정의해두고 사용하겠습니다 :)

```js utils.js
function printMap(map) {
  for (let [key, value] of map) {
    console.log(`key: ${key}, value: ${value}`)
  }
}
// Expected console
// key: something, value: something
```

`Map`은 이터러블 오브젝트이기 때문에 `[key, value]`형식으로 값을 받아서 사용할 수 있습니다.
물론 다음과 같이 함수를 정의할 수도 있습니다.

```js
function print(map) {
  for (let item of map) {
    console.log(Array.isArray(item)) //true
    console.log(item)
  }
}
//Expected console
// [ 'something', 'something' ]
```

`for-of` statement에서 추출된 `item`은 `Array`입니다. 따라서 console에도 `Array` 타입으로 찍힙니다.

### new Map()

`Map` 오브젝트는 다음과 같이 생성가능합니다.

```js
let newMap = new Map([['1', 'one'], ['2', 'two'], ['3', 'three']])

printMap(newMap)
// console
// key: 1, value: one
// key: 2, value: two
// key: 3, value: three
```

### Map.prototype.set(), get()

key와 value를 설정합니다. `set()` 메소드의 반환 값은 `set()` 메소드를 호출한 Map입니다. 그래서 chaining처럼 연속적으로 key와 value를 설정해줄 수 있습니다. `get()`메소드는 인자로 넘겨간 `key`값과 일치하는 `value`를 반환합니다.

```js
let webs = new Map()
webs
  .set('1', 'React')
  .set('2', 'Angular2')
  .set('3', 'Vue')
  .set('2', 'Redux')

printMap(webs)
console.log(`webs.get('1'): ${webs.get('1')}`)
// console
// key: 1, value: React
// key: 2, value: Redux
// key: 3, value: Vue
// webs.get('1'): React
```

### Map.prototype.entries(), keys(), values()

각각 해당하는 이터레이터 오브젝트를 반환하는 메소드입니다.

### Map.prototype.has()

`.has()`는 파라미터로 전달되는 `key`에 해당하는 값이 존재하는지에 대한 여부를 `boolean`으로 반환합니다.

```js
console.log(webs.has('1')) //true
console.log(webs.has('4')) //false
```

### Map.prototype.delete(), clear()

`.delete()`메소드의 파라미터로 특정 `key`값을 넘겨주면 해당 key와 value가 map에서 삭제됩니다. `.clear()`는 모든 `key`와 `value`를 삭제합니다.

```js
console.log(webs.size) // 3
webs.delete('1')
console.log(webs.size) // 2
printMap(webs)
// console
// key: 2, value: Redux
// key: 3, value: Vue

webs.clear()
console.log(webs.size) // 0
printMap(webs)
// console
// undefined
```

### Map.prototype.forEach

`forEach`의 파라미터로는 콜백 함수를 넘겨줍니다.

```js
webs.forEach((value, key, obj) => {
  console.log(`key: ${key}, value: ${value}`)
})

// console
// key: 1, value: React
// key: 2, value: Redux
// key: 3, value: Vue
```

넘겨지는 콜백 함수에는 세 가지 인자가 전달될 수 있습니다. key, value의 순서가 조금 다르다는 것에 주의하면 되겠네요. 세 번째 인자로는 콜백 함수 내부에서 `this`로 참조할 오브젝트가 전달됩니다.

## WeakMap Object

`WeakMap` 오브젝트의 `key`에는 Object만 지정될 수 있습니다.

### GC와의 연관성

`key`로 사용하고 있던 Object 오브젝트가 메모리에서 사라질 경우, 즉 GC에 의해서 Garbage Colleting이 되면, 더이상 `value`의 `key`로서 역할을 수행하지 못합니다. 그렇기 때문에 이 key에 대한 내용을 삭제해줘야 한다. 메모리에서 사라진 `key`에 대해서 삭제하는 작업을 `WeakMap`을 사용하면 자동으로 해결됩니다.

### API

`set()`, `get()`, `has()`, `delete()` 이 네 가지 API만 제공할 뿐, 열거를 위한 API는 제공하지 않습니다. 또한 `size` 프로퍼티가 존재하지 않기 때문에, 특정 시점의 `[key, value]`의 수를 알 수 없습니다. 이는 `WeakMap` 자체적으로 `key`를 제거하므로 값이 비결정적이기 때문에 API를 통해 제공되지 않습니다.

_cf) `Set` 자료구조는 `Map`자료구조의 `key`에 `value`가 들어가게 되는 자료구조 입니다. 그러므로 `Map`과 거의 유사한 API를 제공하며 저장하는 방식의 차이만 존재합니다. 마찬가지로 `Set`과 `WeakSet`은 `Map`과 `WeakMap`의 관계와 동일합니다._

예제로 사용된 코드는 [Github Respository](https://github.com/JaeYeopHan/ECMAScript6_study)에서 확인하실 수 있습니다.

_13. end_
