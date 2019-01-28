---
title: '[ES6] 10. Generator'
date: 2017-04-22 17:49:54
category: 'javascript'
---

![](/images/javascript_es6.png)

## Generator는 무엇인가?

`Generator function`으로 반환된 값을 `Generator Object`라고 하고 이 `Generator Obejct`는 `iterator` 프로토콜을 따르고 있다. 즉 `[Symbol.iterator]`가 프로퍼티에 추가되어 있다는 것이다. `Generator function`안에서는 `yield`라는 키워드를 사용해서 함수에 내부에 작성된 코드를 전부 실행하지 않는다. 제너레이터 함수는 `yield`를 기준으로 실행을 나누어서 진행한다. `iterator`프로토콜을 따르고 있기 때문에 순차적으로 실행할 수 있는 것이다.
_cf>`Generator function`를 `제너레이터 함수`로, `Generator Object`를 `제너레이터 오브젝트`로 표기._

## Generator Function

`function*`로 표현할 수 있으며, 작성할 때는 일반 `function`처럼 선언문과 표현식으로 작성할 수 있다.

```javascript
function* calc(prev, post) {
  console.log('generator start')
  yield prev + post
}
```

or

```javascript
let calc = function*(prev, post) {
  console.log('generator start')
  yield prev + post
}
```

제너리에터 함수에 의해 반환되는 값은 제너레이터 오브젝트이다.

```javascript
let generator = calc(1, 2)
console.log(typeof generator) // object
```

제너레이터 오브젝트를 반환하는 순간에는 오브젝트를 반환하기만 할 뿐, 내부 코드는 실행되지 않는다.

## Generator Object

`new` 키워드를 사용하여 인스턴스를 생성할 수 없다.

```javascript
let cal = new calc() // Error
//TypeError: calc is not a constructor
```

`next()` 메소드를 통해 제너레이터 함수를 실행시킬 수 있다.

```javascript
console.log(generator.next())
//generator start
//{ value: 3, done: false }
console.log(generator.next())
//{ value: undefined, done: true }
```

`iterator`의 `next()`메소드를 실행시킨 것처럼 `value`와 `done`이라는 프로퍼티를 갖고 있는 객체로 반환된다. 그런데 첫번째 `next()`메소드 실행 시에는 `generator start`가 출력되었는데, 두번째 실행 시에는 출력되지 않았다. `yield`라는 키워드를 중심으로 함수가 나눠 실행되는 것이다.

## yield 키워드, 함수를 실행하고 멈출 수 있다.

```javascript
;[returnValue] = yield[expression]
```

위와 같은 구문으로 `yield`를 작성할 수 있다.

위의 예제 코드에서 살펴봤듯이, `next()` 메소드의 반환 값은 `value`와 `done`으로 구성되어 있는 오브젝트이다. 제너레이터의 메소드 `next()`에서 이 두 가지의 값은 yield에 의해 결정된다. `value`가 결정되는 규칙이 조금 복잡하다.

##### value 결정 규칙

- `expression`으로 반환되는 값이 할당.  
  이 때, `expression`에 있는 값이 `returnValue`에 할당되지 않는다.
- `expression`에 아무것도 없으면 `undefined`가 할당.  
  이 때, `next()`의 파라미터로 넘겨지는 값이 `returnValue`에 할당된다.

##### done 결정 규칙

- 계속 수행할 `yield`가 남아있으면 `false`.
- 더 이상 실행할 `yield`가 없으면 `true`.

_예제 코드를 살펴보자._

```javascript
function* calc(prev, post) {
  let result = 0
  console.log(`Initial result: ${result}`)
  result = yield prev + post

  console.log(`Middle result: ${result}`)

  result = yield
  console.log(`Last result: ${result}`)
}

let generator = calc(10, 20)
```

위에서 언급한 규칙에 대한 내용을 모두 담고 있는 예제코드이다. `console.log()`에는 어떠한 값이 찍히게 될까? 코드를 통해 하나씩 살펴보자.

```javascript
console.log(generator.next())
// Initial result: 0
// { value: 30, done: false }
```

`next()` 메소드를 실행시키면 첫번째 yield까지 실행한다.
초기 `result` 변수에 대한 값이 출력되고,
`expression`으로 계산된 값인 `30`이 `value`이 출력된다.
아직 `yield`가 남았으니 `done`은 `false`가 되겠다.

```javascript
console.log(generator.next())
// Middle result: undefined
// { value: undefined, done: false }
```

두번째 yield까지 실행한다.
`expression` 값이 `result`에 할당되지 않은 것을 확인할 수 있다.
아직 `yield`가 남았으니 `done`은 `false`가 되겠다.

```javascript
console.log(generator.next(20))
// Last result: 20
// { value: undefined, done: true }
```

yield가 없으므로 brace까지 실행한다.
`next()`메소드의 파라미터로 넘겨진 `20`이 `result` 변수에 할당된 것을 확인할 수 있다.
더이상 `yield` 키워드가 없으므로 `done`은 `true`가 된다.

### yield 대신 return

```javascript
function* calc(prev, post) {
  return prev + post
}

let generator = calc(10, 20)
console.log(generator.next())
// { value: 30, done: true }
```

`return` 키워드 뒤에 오는 값이 `value`에 할당되고 `yield` 키워드의 유무와 상관없이 `done`에는 `true`가 할당된다. `return`은 수행되고 있는 이터레이터를 종료시키는 역할을 수행한다.

### 이터레이터 종료하기

`yield` 키워드의 유무와 상관없이 이터레이터를 종료하고자 할 때는 제너레이터 오브젝트의 `throw()`메소드와 `return()`메소드를 사용할 수 있다.

```javascript
function* idMaker(prev, post) {
  let value = 0
  while (true) {
    yield ++value
  }
}

let g = idMaker()
console.log(g.next()) // { value: 1, done: false }
console.log(g.next()) // { value: 2, done: false }
console.log(g.next()) // { value: 3, done: false }
console.log(g.return(100)) // { value: 100, done: true }
```

`return()`메소드의 파라미터로 넘어가는 값이 `value`에 할당된다.
위의 예제 코드에 `return()` 대신 `throw()`를 호출하게 되면 파라미터로 넘겨준 Error Message를 출력하고 이터레이터가 바로 종료된다.

```javascript
function* idMaker(prev, post) {
  let value = 0
  try {
    while (true) {
      yield ++value
    }
  } catch (e) {
    console.log(`Error message: ${e}`)
  }
}

let g = idMaker()
console.log(g.next()) // { value: 1, done: false }
console.log(g.next()) // { value: 2, done: false }
console.log(g.next()) // { value: 3, done: false }
console.log(g.throw('Throw Exception'))
//Error message: Throw Exception
//{ value: undefined, done: true }
```

여기서 `try-catch` 구문에 `yield`를 추가하면 어떻게 될까?

```javascript
function* idMaker(prev, post) {
  let value = 0
  try {
    while (true) {
      yield ++value
    }
  } catch (e) {
    yield e
  }
}

let g = idMaker()
console.log(g.next()) // { value: 1, done: false }
console.log(g.next()) // { value: 2, done: false }
console.log(g.next()) // { value: 3, done: false }
console.log(g.throw('Throw Exception'))
//{ value: 'Throw Exception', done: false }
console.log(g.next()) // { value: undefined, done: true }
```

바로 이터레이터가 종료되지 않고 `yield` 다음의 구문이 실행된다.

## yield\* 키워드

`yield`에 `*`를 붙인 다음 `[expression]`에 이터러블 오브젝트를 작성할 수 있다. 이렇게 되면 해당 `yield`가 수행될 때 이터러블 오브젝트를 순회하게 된다. 코드를 통해 살펴보자.

```javascript
function* gen() {
  yield 1
  yield* [10, 20, 30]
  yield 2
}
let g = gen()
console.log(g.next()) // { value: 1, done: false }
console.log(g.next()) // { value: 10, done: false }
console.log(g.next()) // { value: 20, done: false }
console.log(g.next()) // { value: 30, done: false }
console.log(g.next()) // { value: 2, done: false }
console.log(g.next()) // { value: undefined, done: true }
```

우선적으로 배열을 순회한 후에, 다음에 해당하는 `yield`를 수행하게 된다.

#### 마무리

문법을 아는 것과 실제 프로그래밍에서 적용하는 것은 확실히 다른 문제이다. 지금 `yield`의 향연을 보고 이걸 어디에다가 쓰나 하는 생각이 들 것이다. 다음 링크들을 참고하면 좀 나아질 것 같아서, 몇 가지 링크를 첨부한다.

[ES6의 제너레이터를 사용한 비동기 프로그래밍](http://meetup.toast.com/posts/73)
[Javascript의 Generator와 Koa.js](http://www.haruair.com/blog/3425)
[자바스크립트와 비동기 오류 처리](http://blog.coderifleman.com/2014/11/15/javascript-and-async-error/)

#### Reference

[MDN function\*](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/function*)

예제로 사용된 코드는 [Github Respository](https://github.com/JaeYeopHan/ECMAScript6_study)에서 확인하실 수 있습니다.

_10. end_
