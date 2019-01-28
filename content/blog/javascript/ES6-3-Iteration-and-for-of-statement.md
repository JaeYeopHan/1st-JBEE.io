---
title: '[ES6] 3. Iteration and for-of statement'
date: 2017-04-18 13:52:45
category: 'javascript'
---

![](/images/javascript_es6.png)

## Iteration

ES6에서 이터레이션 프로토콜은 `Iterable 프로토콜`과 `Iterator 프로토콜`로 구성된다. 결론부터 말하자면 `Iterable` 프로토콜은 `반복 가능한` 오브젝트를 나타내는 프로토콜이며 `Iterator` 프로토콜은 이터러블 오브젝트(`Iterable` 프로토콜을 따르는 오브젝트)의 값을 `작성한 순서대로` 처리하는 프로토콜이다.

## Iterable 프로토콜

오브젝트의 반복 처리 규약을 정의한다.
Iterable Object

> `String`, `Array`, `Map`, `Set`, `TypedArray`, `Argument` 오브젝트
> 그리고 DOM의 `NodeList`

위 *built in 오브젝트*들은 디폴트로 이터러블 프로토콜을 갖고 있다. 오브젝트에 `Symbol.iterator`가 있어야 한다. `Symbol.iterator`가 있는 오브젝트는 이터러블 오브젝트이다. 또한 상속받은 prototype chain에 있어도 이터러블 오브젝트이다. (`Symbol`에 대해서는 다음 포스팅에서 다룰 예정이다.)

오브젝트에 프로퍼티 존재 여부를 체크할 때, Symbol의 경우에는 arrayObj[Symbol.iterator]와 같이 대괄호 `[]`안에 작성해야 한다.

```javascript
let arr = []
console.log(arr[Symbol.iterator]) //function values() { [native code] }
let obj = { a: 1 }
console.log(obj[Symbol.iterator]) //undefined
```

`Array` 오브젝트는 기본적으로 `iterable` 프로토콜을 구현한다. 하지만 `Object` 오브젝트는 `iterable` 프로토콜을 구현하지 않는다.

```javascript
let iteratorObj = arr[Symbol.iterator]() //iterator object
```

위와 같은 방식으로 `Array` 오브젝트는 `iterator`를 받을 수 있다.

## JavaScript’s for statement

### forEach

forEach 문은 arrow function과 조합해서 사용하면 추가적인 변수 사용 없이 코드가 깔끔해질 수 있다.

```javascript
let categories = ['Korean', 'English', 'Science']
categories.forEach(subject => {
  console.log(subject)
})
console > Korean
English
Science
```

그러나 for문 중간에 `continue` or `break` or `return` 선언문을 사용할 수 없다. 기존의 for-statement를 사용하는 경우를 보자.

```javascript
for (let i = 0; i < subject.length; i++) {
  console.log(categoried[i])
}
console > Korean
English
Science
```

`i`의 역할이 index를 잡아주는 것 외에 별 다른 기능이 없다. 그래서 기존에는 `for-in statement`를 사용했다. 하지만 `for-in statement` 은 문자열 키를 가진 일반 `Object` 객체들을 위해 만들어졌다.

```javascript
for (let item in categories) {
  console.log(item)
}
console > 0
1
2
```

그래서 ES6에서 `for-of statement`가 등장했다.
`for-in loop statement`는 객체의 프로퍼티들을 루프시키지만 `for-of loop statement`는 데이터, 즉 배열 내의 value들을 루프시킨다. 또한 for-of는 배열 뿐만 아니라 다양한 Collection에도 동작한다. DOM의 `NodeList` 같은 유사배열 객체들에도 동작하고 문자열에도 동작한다. 문자열을 유니코드 문자의 배열로 취급하는 것이다. `Set`, `Map`에 대해서도 물론 동작한다. key-value 형식의 `Map`에 대해서는 for (let [key, value] of …) 형식의 `destructuring`을 사용한다.

```javascript
for (let item of categories) {
  console.log(item)
}
console > Korean
English
Science
```

단 for-of 가 만능은 아니다. `Object`의 프로퍼티를 루프시키려면 `for-in statement`를 사용해야 한다. 사실 `for-in statement`의 원래 목적이 `Object` 프로퍼티 순회이다. Object를 순회하는 경우를 살펴보자.

```javascript
let obj = {
  one: 1,
  two: 2,
  three: 3,
}
```

위와 같은 obj라는 오브젝트를 정의한다.

```javascript
for (let key in obj) {
  console.log(key)
}

// console>
// one
// two
// three
```

`for-in statement`를 통해서 정의한 오브젝트(obj)의 key를 순회했다.

```javascript
for (let key in obj) {
  console.log(obj[key])
}
// console>
// 1
// 2
// 3
```

오브젝트를 `for-of statment`로 순회하면 어떻게 될까?

```javascript
for (let item of obj) {
  console.log(item)
}
// console>
// Uncaught TypeError: obj[Symbol.iterator] is not a function
```

JavaScript의 Object는 `iterable` 프로토콜을 구현하고 있지 않기 때문에, `Symbol.iterator`가 존재하지 않는다.

예제로 사용된 코드는 [Github Respository](https://github.com/JaeYeopHan/ECMAScript6_study)에서 확인하실 수 있습니다.

_3. end_
