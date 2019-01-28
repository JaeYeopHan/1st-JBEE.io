---
title: 'ES8 Standard Release Overview'
date: 2017-07-16 19:11:00
category: 'javascript'
---

![](/images/es8_standard_release.png)

얼마 전, standard release가 되었는데요, 이 글은 ECMAScript2017 (a.k.a es8)의 주요 스펙에 대해 간단하게 살펴보는 포스팅입니다.

```bash
$ npm install --save-dev babel-core babel-preset-es2017
```

아시다시피 `babel`을 통해서 바로 `es2017`을 사용해보실 수 있습니다.

- [babel-preset-es2017](https://github.com/bettiolo/babel-preset-es2017)
- [es8_playground Repository](https://github.com/JaeYeopHan/es8_playground)

## ES8 Overview

_es8의 주요 기능은 다음과 같습니다._

- String.prototype.padStart/String.prototype.padEnd
- Object.entries/Object.values
- Object.getOwnPropertyDescriptors
- Trailing Commas in Function Param Lists
- Async Functions

간단한 예제를 통해 알아보겠습니다 :)

</br>

## String padding

`String` 객체에 두 개의 메소드 `padStart`, `padEnd`가 추가되었습니다.

```js
String.prototype.padStart(targetLength [, padString])
String.prototype.padEnd(targetLength [, padString])
```

메소드를 호출하는 문자열의 길이를 주어진 `targetLength`에 도달하도록 하는 메소드입니다. `padString`으로 전달된 문자열을 통해 주어진 길이에 도달할 수 있습니다. `padString` 값을 따로 전달하지 않는 경우 공백으로 문자열의 길이가 도달하게 됩니다.

`padStarat`의 경우는 문자열의 시작 부분에 값을 추가하여 문자열의 길이를 조정하고 `padEnd`는 문자열의 끝 부분에 값을 추가하여 문자열의 길이를 조정합니다.

- `targetLength`의 크기가 함수를 호출하는 문자열의 길이보다 작을 경우 문자열의 길이는 변하지 않습니다.
- `padString`으로 넘겨진 문자열로 길이를 맞출 경우, 각각의 문자열에 대해서 채워지고 길이를 넘어가게 되면 버려지게 됩니다.

```js
// String.prototype.padStart
'hi'.padStart(1) // 'hi'
'hi'.padStart(2) // 'hi'
'hi'.padStart(5) // '   hi'
'hi'.padStart(5, 'p') // 'ppphi'
'hi'.padStart(5, 'power') // 'powhi'

// String.prototype.padEnd
'hi'.padEnd(1) // 'hi'
'hi'.padEnd(2) // 'hi'
'hi'.padEnd(5) // 'hi   '
'hi'.padEnd(5, 'p') // 'hippp'
'hi'.padEnd(5, 'power') //'hipow'
```

</br>

## Object.entries(), Object.values()

Object에 `entries()` 함수와 `values()` 함수가 추가되었습니다.

```js
Object.entries(obj)
Object.values(obj)
```

`entries` 함수는 파라미터로 전달된 객체의 `key-value`를 배열로 반환합니다. `values` 함수는 파라미터로 전달된 객체의 `value`만을 배열로 반환합니다.

```js
const obj = { '1': 'one', '2': 'two', '3': 'three' }
Object.entries(obj) // [["1", "one"], ["2", "two"], ["3", "three"]]
Object.values(obj) // ["one", "two", "three"]
```

</br>

## Object.getOwnPropertyDescriptor**s**

ES5 스펙에서부터 `Object.getOwnPropertyDescriptor`란 녀석이 있었는데요, 이번에 추가된 함수는 `getOwnPropertyDescriptors`입니다. (뒤에 's'가 추가되었네요.)

```js
const object = { '1': 'one', '2': 'two', '3': 'three' }
Object.getOwnPropertyDescriptor(object, '1')
// {
//     value: "one",
//     writable: true,
//     enumerable: true,
//     configurable: true
// }
```

`Object.getOwnPropertyDescriptor(obj, prop)` 메서드는 주어진 객체 자신의 속성(즉, 객체에 직접 제공하는 속성, 객체의 프로토타입 체인을 따라 존재하는 덕택에 제공하는 게 아닌)에 대한 속성 설명자(descriptor)를 반환합니다. ES5에서는 `obj` 파라미터에 원시 데이터 타입이 전달될 경우 `TypeError`가 발생했지만 ES6에서는 객체로 강제하기 때문에 에러가 발생하지 않습니다.

ES8에서는 `.getOwnPropertyDescriptors`를 제공하여 전달된 객체의 모든 프로퍼티에 대한 descriptor에 접근할 수 있습니다. `{1: Object, 2: Object, ...}` 형태인 객체로 반환되어 접근할 수 있습니다. (배열로 반환하지 않습니다.)

```js
const object = { '1': 'one', '2': 'two', '3': 'three' }
Object.getOwnPropertyDescriptors(object)
// {
//     1: {
//         configurable: true,
//         enumerable: true,
//         value: "one",
//         writable: true,
//     },
//     2: {
//         ...
//     },
//     3: {
//         ...
//     }
// }
```

</br>

## 함수 매개 변수 목록에서 후행 쉼표

함수 매개 변수에서 후행 쉼표가 가능해졌습니다. 기존에는 `syntax error`를 발생시켰습니다. 추가된 이 문법은 다음을 가능하게 합니다.

```js
class Person {
  constructor(firstName, lastName, age) {
    this.firstName = firstName
    this.lastName = lastName
    this.age = age
  }
}
```

객체를 선언할 때, 후행 comma를 통해 선언한 경우와 비슷하다고 생각됩니다. 수정이 필요할 경우, 수정이 필요한 파라미터의 한 줄만 수정하면 됩니다. 함수를 호출할 때도 마찬가지로 후행 comma를 사용할 수 있습니다.

```js
function tailingComma(param1, param2, param3) {
  console.log(`${param1} ${param2} ${param3}`)
}

tailingComma('hello', 'es8', 'world')
```

</br>

## Async functions

이미 많이 들 사용하고 계실거라 생각됩니다만 ES8부터 공식 release되었습니다. 간단한 예제로만 설명하고 넘어갑니다 :)

```js
const fetchData = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('fetch complete!')
    }, 2000)
  })
}

console.log(`before`)
fetchData().then(data => console.log(data))
console.log(`after`)

// console>
// before
// after
// fetch complete!

// Use Async function
const sayComplete = async () => {
  const message = await fetchData()
  console.log(`status: ${message}`)
}

console.log(`before`)
sayComplete()
console.log(`after`)
// console>
// before
// after
// status: fetch complete!
```

감사합니다 :)

#### Reference

- https://hackernoon.com/es8-was-released-and-here-are-its-main-new-features-ee9c394adf66
- [async function tip](http://2ality.com/2016/10/async-function-tips.html)
- [MDN Object.getOwnPropertyDescriptor()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)
- [MDN Object.getOwnPropertyDescriptors()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors)
