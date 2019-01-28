---
title: '[ES6] 12. Array API'
date: 2017-05-11 14:22:30
category: 'javascript'
---

![](/images/javascript_es6.png)

JavaScript의 Array가 제공하는 API들에 대해서 살펴봅니다.

`! Array.[methodName] vs Array.prototype.[methodName]`
위 두 가지는 접근 방법이 다릅니다. 전자는 Array라는 오브젝트의 메소드이며 후자는 Array 타입의 모든 오브젝트에서 사용할 수 있는 메소드입니다. 간단한 예제를 통해 살펴보겠습니다.

```js
const arr = [1, 2, 3]
arr.from('jbee') //Error: arr.from is not a function
for (let item of arr.values()) {
  console.log(item)
}
//console
//1
//2
//3
```

`Array.from()`과 `Array.prototype.values()` 둘 차이를 보여주는 예제였습니다 :D
그럼 이제 Array API들에 대해 알아봅시다.

## Array.from()

- `from()`은 유사배열(Array-Like-Object)을 배열로 바꿔줍니다.

```js
const arrLikeObj = { '0': 'zero', '1': 'one', '2': 'two', length: 3 }
const arrFrom = Array.from(arrLikeObj)

console.log(arrFrom) //Array ['zero', 'one', 'two']
```

이 방법을 통해 `String`을 Array로 변경할 수 있습니다.

```js
const str = 'Jbee'
console.log(Array.from(str)) //Array ['J', 'b', 'e', 'e']
console.log(new Array(...str)) //Array ['J', 'b', 'e', 'e']
```

ES6의 문법인 `Spread` 연산자를 사용해서도 가능합니다.
`from()`을 다음과 같은 경우에 사용하면 유용할 것 같습니다.

```js
const ul = document.getElementById('content')
const ulClassList = ul.classList
console.log(ulClassList)
//["content-list", "foo", "bar", "baz", value: "content-list foo bar baz"]
console.log(Array.isArray(ulClassList)) //false

const ulClassArr = Array.from(ulClassList)
console.log(ulClassArr) //["content-list", "foo", "bar", "baz"]
console.log(Array.isArray(ulClassArr)) //true
```

DOM의 `classList`는 유사배열(Array-Like-Object)로 반환이 됩니다. 이것을 `from()`을 사용하여 배열로 변경하여 Array API를 사용할 수 있도록 바꿔줄 수 있습니다.

- `from()`의 두번째 인자로 콜백 함수를 넘겨줄 수 있습니다.

```js
const arrLikeObj = { '0': 100, '1': 101, '2': 102, length: 3 }
const arrFromWithCb = Array.from(arrLikeObj, elm => elm + 100)
```

Array로 변경된 각각의 엘리먼트들을 `elm`으로 받아서 100을 더해줍니다.

```js
console.log(arrFromWithCb) // [200, 201, 202]
```

- `from()`의 세번째 인자로는 두번째 인자로 넘겨준 콜백 함수에서 참조할 오브젝트를 넘겨줄 수 있습니다.

```js
const arrFromWithCb3 = Array.from(
  arrLikeObj,
  function(elm) {
    return +elm + this.value
  },
  { value: 200 }
)
console.log(arrFromWithCb3) //[300, 301, 302]
```

`this`를 통해 참조하기 때문에 `arrow function`대신에 **일반 함수**를 사용하여 콜백 함수를 전달해줬습니다.

</br>

## Array.of()

`of()`로 전달되는 파라미터 값을 배열로 반환합니다.

```js
const arr = Array.of(1, 2, 3)
console.log(Array.isArray(arr)) //true
console.log(arr) //[1, 2, 3]
```

문자열도 `Spread` 연산자와 함께 사용하면 배열로 변환할 수 있습니다.

```js
const str = `Jbee`
const strArr = Array.of(...str)
console.log(Array.isArray(strArr)) //true
console.log(strArr) //['J', 'b', 'e', 'e']
```

</br>

## Array.prototype.entries()

Array 오브젝트의 iterator를 반환하는 메소드입니다.

```js
const arr = [1, 2, 3]

for (let item of arr) {
  console.log(`${item}`) //1  2  3
}

for (let [key, value] of arr.entries()) {
  console.log(`${key} : ${value}`) //0:1  1:2  2:3
}
```

key와 value는 각각 `Array.prototype.keys()`, `Array.prototype.values()`으로도 접근할 수 있습니다.

</br>

## Array.prototype.find()

`find()` 파라미터로 콜백 함수를 넘겨서 처리한 내용을 반환합니다.

```js
const arr = ['Jbee', 'babel', 'React']
const result = arr.find(elm => elm.includes('e'))
console.log(result) //'Jbee'
```

`e`를 포함하고 있는 문자열은 `'Jbee'`, `'babel'`, `'React'` 모두 해당하는데 `'Jbee'`만 반환했습니다. `find()`는 콜백 함수로 넘겨진 조건이 `true`되는 순간 반환하기 때문에 그 다음은 확인하지 않습니다.

`Array.prototype.findIndex()`을 통해서 `value`가 아닌 `index`를 반환하게 하는 API도 존재합니다.

</br>

## Array.prototype.filter()

위 `find()`와는 다르게 다시 `Array`를 반환합니다.

```js
const arr = ['Jbee', 'babel', 'React']
const result = arr.filter(elm => elm.includes('e'))
console.log(result) //'Jbee', 'babel', 'React'
```

전달받은 콜백 함수로 각 엘리먼트들의 조건을 판단하여 `true`인 엘리먼트들에 대해서만 Array를 반환합니다.

</br>

## Array.prototype.map()

마찬가지로 다시 `Array`를 반환하는데, 배열의 엘리먼트에 접근하여 엘리먼트의 값을 reformat할 수 있습니다.

```js
const arr = ['Jbee', 'babel', 'React']
const result = arr.map((elm, i) => `${i}: ${elm}`)
console.log(result) // ['0: Jbee', '1: babel', '2: React']
```

콜백 함수의 두번째 인자, `i`로 API를 호출한 배열의 인덱스에 접근할 수 있습니다.

## Array.prototype.reduce()

배열의 각 값에 대해(0부터 arr.length 순서로) 넘겨받은 콜백 함수의 결과를 하나의 값으로 반환합니다.
콜백 함수의 인자로는 총 네 가지를 받을 수 있습니다.
`previousValue`, `currentValue`, `currentIndex`, `array`

```js
const result = [0, 1, 2, 3].reduce(function(
  previousValue,
  currentValue,
  currentIndex,
  array
) {
  return previousValue + currentValue
})
console.log(result) // 6
```

arrow function을 사용하면 다음과 같습니다.

```js
const result = [0, 1, 2, 3].reduce((pre, cur) => pre + cur)
console.log(result)
```

</br>

Array.prototype에서 제공하는 `pop`, `push`, `splice`, `sort` 등은 배열 자체를 변화시킵니다.
`concat`, `slice`, `join`, `indexOf` 함수들은 새로운 배열을 반환합니다.

## Array.prototype.splice(), Array.prototype.slice()

`splice`에 전달되는 인자는 `startIndex`, `deleteCount`, `newItem` 총 세 개입니다.

```js Array.prototype.splice()
const arr = [{ 0: 'zero' }, { 1: 'one' }, { 2: 'two' }]
const result = arr.splice(0, 1, { 4: 'foour' })
console.log(arr) // [{4: 'foour'}, {1: 'one'}, {2: 'two'}]
console.log(result) // [{0: 'zero'}]
```

`slice`에 전달되는 인자는 `startIndex`, `deleteCount` 총 두 개입니다.

```js Array.prototype.slice()
const arr = [{ 0: 'zero' }, { 1: 'one' }, { 2: 'two' }]
const newArr = arr.slice(0, arr.length)
console.log(arr) // [{0: 'zero'}, {1: 'one'}, {2: 'two'}]
console.log(newArr) // [{1: 'one'}, {1: 'one'}, {2: 'two'}] is new Array
```

기존의 `arr`에는 변경사항이 존재하지 않고 새로운 Array 오브젝트가 반환된 것을 확인하실 수 있습니다.

</br>

### 마무리

Array에서 제공하는 기본적인 메소드들에 대해서 알아봤습니다. 포스트에서 소개한 메소드 이외에도 여러 메소드들이 존재하는데요, 잘 사용하면 보다 깔끔한 코드를 작성할 수 있겠습니다 :)

예제로 사용된 코드는 [Github Respository](https://github.com/JaeYeopHan/ECMAScript6_study)에서 확인하실 수 있습니다.

#### Reference

https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
http://programmingsummaries.tistory.com/357

_12. end_
