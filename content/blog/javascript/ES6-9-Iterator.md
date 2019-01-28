---
title: '[ES6] 9. Iterator'
date: 2017-04-21 17:15:09
category: 'javascript'
---

![](/images/javascript_es6.png)

[>>3. Iterable and for-of statement>>](../ES6-3-Iteration-and-for-of-statement/)
[>>8. Symbol](../ES6-8-Symbol/)

_이 포스팅은 이전에 작성된 두 포스팅을 기반으로 작성되었습니다._

`iterator`는 순회 가능한 값들의 `시퀀스`를 만드는 방법을 정의한다.
대표적인 순회 가능한 것은 `Array`다. `Array` 오브젝트는 `Symbol.iterator`를 가지고 있다.

```javascript
let arr = [1, 2, 3]
console.log(typeof arr[Symbol.iterator]) // function
```

위 예제 코드에서 정의한 `arr`의 `iterator`를 추출하여 `arr`를 순회할 수 있다.

```javascript
let iterator = arr[Symbol.iterator]()
console.log(iterator.next()) // {value: 1, done: false}
console.log(iterator.next()) // {value: 2, done: false}
console.log(iterator.next()) // {value: 3, done: false}
console.log(iterator.next()) // {value: undefined, done: true}
```

`iterator`를 추출하자마자 `head`(공식 용어는 아니고 설명을 위한 용어)는 배열의 시작점을 가리키게 된다.(첫 원소를 가리키는 것이 아니다.) 그 상태에서 `next()`메소드를 호출하게 되면, 첫번재 원소가 출력된다. 출력 값은 원소의 값인 `value`와 `done`이라는 `boolean` 값을 가지고 있는 `Object`이다. 마지막 원소까지 출력된 상태에서 `next()` 메소드를 호출하게 되면 `value`는 `undefined`가 되고 `done` 값은 `true`가 된다.

문자열에도 적용할 수 있다. `String` 오브젝트도 `iterable`프로토콜을 구현한 오브젝트이기 때문에 `iterator`를 사용할 수 있는 것이다.

```javascript
let name = 'jbee'
let iterator = name[Symbol.iterator]()
console.log(iterator.next()) // {value: j, done: false}
console.log(iterator.next()) // {value: b, done: false}
console.log(iterator.next()) // {value: e, done: false}
console.log(iterator.next()) // {value: e, done: false}
console.log(iterator.next()) // {value: undefined, done: true}
```

`Object`에는 기본적으로 `iterator`가 존재하지 않는다. 때문에 `for-of`로 순회할 수 없다. 하지만 `iterator`를 오브젝트에 추가하여 `iterable`하게 만들 수 있다. 또한 배열을 상속받은 객체는 `iterable` 객체이므로 `iterator`를 사용할 수 있다.

`iterator`를 사용하다 보면 뭔가 Java의 `interface` 또는 `@FunctionalInterface` 같은 느낌도 든다. java에서 해당 `interface`를 `implements`하게 되면 해당 기능을 사용할 수 있는 것처럼 구현하고자 하는 `Symbol`, 즉 `iterator`를 프로퍼티에 추가해서 사용하면 `iterator` 기능을 사용할 수 있는 것이다.

어떻게 하면 `iterator`를 그럴싸하게 사용해볼 수 있을까?
다음 예제는 이렇게 사용하면 어떨까? 정도의 예제 코드이다. 가볍게 보고 넘어가자.

```javascript
// Object to create id
let autoIncrement = {
  [Symbol.iterator]() {
    let id = 0
    return {
      next() {
        return {
          value: ++id,
          done: false,
        }
      },
    }
  },
}
// Define User class
class User {
  constructor(id, name) {
    this.id = id
    this.name = name
  }
}
const idCreator = autoIncrement[Symbol.iterator]()
console.log(new User(idCreator.next().value, 'jbee')) // { id: 1, name: 'jbee' }
console.log(new User(idCreator.next().value, 'foo')) // { id: 2, name: 'foo' }
console.log(new User(idCreator.next().value, 'bar')) // { id: 3, name: 'bar' }
```

`autoIncraement` 객체에 `iterator` 프로퍼티를 추가하여, `id`를 순차적으로 생성하게 만들었다. `id`에 대해서는 외부에서 접근할 수 없으므로 안정적인 `id`가 생성될 수 있지 않을까?

예제로 사용된 코드는 [Github Respository](https://github.com/JaeYeopHan/ECMAScript6_study)에서 확인하실 수 있습니다.

_9.end_
