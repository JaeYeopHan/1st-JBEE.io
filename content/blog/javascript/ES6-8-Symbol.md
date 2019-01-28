---
title: '[ES6] 8. Symbol'
date: 2017-04-20 11:53:45
category: 'javascript'
---

![](/images/javascript_es6.png)

## Symbol이란 무엇인가?

> 고유하고 수정 불가능한 데이터 타입(?)

자바스크립트에는 `Primitive type`이라는 개념이 있다. ES5에는 `string`, `number`, `boolean`, `null`, `undefined`로 총 **5가지**의 원시 자료형이 존재한다. 여기에 ES6부터 `symbol`이라는 타입이 추가되었다.

`Primitive type`들에게는 각각 Wrapper Object가 존재한다.(undefined와 null은 wrapper object가 존재하지 않는다.) `String` 오브젝트, `Boolean`오브젝트가 그 예이다. `symbol`도 마찬가지로 `Symbol` 오브젝트라는 wrapper Object가 존재한다. 각각의 wrapper obect에는 값을 처리하기 위한 메서드와 프로퍼티가 존재한다. `valueOf()`메소드를 통해 primitive value를 구할 수 있는 것이다. 하지만, `symbol`은 값을 반환하지 않는다!

## Symbol 도입 배경

> 왜 Symbol이 도입되었을까?

처음 `Symbol`을 봤을 때는 `고유한 값`이라는 말에 `const`를 떠올렸다. 하지만 `Symbol`은 프로그램 전체를 통틀어 유일한 값을 의미한다. `Symbol()`이 실행될 때마다 유일한 값을 생성하는 것이다. 약속된 `Symbol` 값을 가지고 객체에 어떠한 특성을 부여할 수 있지 않을까? `Symbol`이란 무엇인가 먼저 알아보자.
_(사실 라이브러리를 만들거나 프레임워크를 만들지 않는 이상, 실무에서 사용할 일이 거의 없을 것 같다.)_

## Symbol에 대해서

`Symbol`은 두 가지 `스코프(scope)`에 `생성`하여 `저장`할 수 있다.

### Symbol 생성하기 1

```javascript
let s = new Symbol('symbol description')
//Error: Symbol is not a constructor
```

`Symbol`은 **객체가 아니다.** 객체가 아닌 `Primitive type`이기 때문에 `new`키워드를 통해서 생성할 수 없다.
`Symbol`을 생성할 때에는 다음과 같이 생성한다.

```javascript
let s = Symbol('symbol description')
```

`console.log()`를 통해 `Symbol`의 특징을 살펴보자.

```javascript
console.log(typeof s) //symbol
console.log(s.toString()) //Symbol(symbol description)
console.log(s.valueOf()) //{}
console.log(s) //{}
```

1. `Symbol`의 타입은 `symbol`이다.
2. 모든 built-in 오브젝트의 프로토타입에 연결되어 있는 `toString` 메소드를 통해서 `Symbol`의 `형태(description)`를 확인할 수 있다. 여기서 `형태`란 `Symbol`을 생성할 때 넘겨지는 parameter를 말한다. 주로 생성하는 `Symbol`을 설명하기 위한 문자열을 넘겨준다. 왠지 이 값을 통해 `Symbol`에 접근할 수 있을 것 같지만 그럴 수 없다.
3. 뒤에서 확인할 테지만 `Symbol`은 값을 외부로 노출시키지 않는다. 이러한 특성 때문에 `Symbol`을 출력하려고 하거나 `valueOf()` 메소드를 통해 값을 출력하려고 하면 `empty object`가 반환이 된다.

```javascript
let s1 = Symbol('foo')
let s2 = Symbol('foo')
console.log('s1: ', s1.toString()) //Symbol(foo)
console.log('s2: ', s2.toString()) //Symbol(foo)
console.log(s1 == s2) //false
```

두 `Symbol`은 같은 `description`을 갖고 있는 `Symbol`일 뿐, 다른 `Symbol`이다. `Symbol()`이 **호출될 때마다** 새로운 `Symbol`을 생성하기 때문이다. 이 때 `Symbol`은 생성한 `scope`에 `Symbol`값이 설정된다.

### Symbol 생성하기 2, key

아까 생성한 `Symbol`을 다시 사용할 니즈가 있을 것 같다. 그래서 고유한 값을 갖는 `Symbol`을 만들 때, `key`를 등록하고, `key`를 통해 접근한다.

- `for` 메소드  
  `for` 메소드를 사용하여 생성 또는 호출할 수 있다. `key` 값이 파라미터로 넘어가고 등록되어 있는 `Symbol`을 반환한다. 이 때 `key` 값에 해당하는 `Symbol`이 없다면 해당 `Symbol`을 `Symbol registry`에 등록한다. 즉 없으면 생성하는 것이다.
- `keyFor` 메소드  
  `keyFor` 메소드는 `Symbol`을 받아서 해당 `Symbol`의 `description` 값을 반환한다.

```javascript
let sFor1 = Symbol.for('foo')
let sFor2 = Symbol.for('foo')
console.log(sFor1.toString()) //Symbol(foo)
console.log(sFor2.toString()) //Symbol(foo)
console.log(Symbol.keyFor(sFor1)) //foo
console.log(Symbol.keyFor(sFor2)) //foo
console.log(sFor1 == sFor2) //true
console.log(sFor1 === sFor2) //true
```

같은 `key`값으로 `Symbol`을 호출하게 되면 두 `Symbol`은 같은 `Symbol`이다. 위에서 그냥 `Symbol()`을 통해 생성한 것과의 차이점은 `key`값과 함께 `Symbol`을 만들게 되면 `Global Symbol registry`에 해당 `Symbol`이 등록되어 `Symbol()`이 호출될 때마다 새로운 `Symbol`이 생성되지 않는다.
_cf> `Global Symbol registry`란 `Symbol`값을 공유하기 위한 영역으로 다른 자바스크립트 프레임워크에서도 공유할 수 있다._

### Symbol 특징 1

위의 예제에서도 살펴봤듯이, `Symbol`은 값을 외부에 노출시키지 않는다.

```javascript
let sym = Symbol('symbol description')
console.log(`symbol: ${sym}`)
//TypeError: Cannot convert a Symbol value to string
```

그렇기 때문에 `Template literal`에서 사용할 수 없다. 또한 `JSON.stringify()`메소드를 통해서 특정 오브젝트를 `stringify`하려고 해도 빈 객체가 리턴된다.

```javascript
let sym = Symbol('symbol description')
let obj = {
  [sym]: 'value',
}
let str = JSON.stringify(obj)
console.log(str) //{}
```

값을 외부에 노출시키지 않기 때문이다.

### Symbol 특징 2

객체에 `Symbol`로 등록된 프로퍼티를 `symbol-keyed property`라고 하는데 이 `symbol-keyed property`는 Object의 `getOwnPropertyNames` 반환 값에서 제외된다.

```javascript user.js
let user = {
  [Symbol.for('name')]: 'jbee',
  age: 25,
  major: 'Computer Science',
}
console.log(Object.getOwnPropertyNames(user)) //['age', 'major']
```

그렇기 때문에 `for-in statement`에서 열거되지 않는다.

```javascript user.js
for (let item in user) {
  console.log(item)
}
console > age
major
```

Object의 `symbol-keyed property`는 `getOwnPropertySymbols()` 메소드를 통해 확인할 수 있다.

```javascript user.js
console.log(Object.getOwnPropertySymbols(user)[0].toString()) //Symbol(name)
```

`symbol-keyed property`로 value에 접근할 때는 `[]`를 통해 접근해야 한다. `.`을 통해 접근하면 `undefined`가 반환된다.

```javascript
const sym = Symbol.for('name')
let user = {
  [sym]: 'jbee',
}
console.log(user.sym) //undefined
console.log(user[sym]) //jbee
```

`.`(dot)을 통해서 `getOwnPropertyNames`에서 반환되는 **일반적인** 프로퍼티에 접근했다면 `symbol-keyed property`에는`[]`을 통해 접근하는 것이라고 생각해볼 수 있겠다.

## Well-known Symbols

`built-in Symbol property`로 Override하여 기능을 추가 및 변경할 수 있다. 대표적인 세 가지에 대해 알아보자.(`iterator`는 다음 포스팅에서 따로 다룬다.)

### Symbol.toStringTag

객체의 기본 설명(description)에 사용되는 문자열 값을 지정할 수 있으며 `Object.prototype.toString()` 메소드가 호출될 때 사용된다.

```javascript
class User {
  constructor(name) {
    this.name = name
  }
}

let user = new User('jbee')
console.log(user.toString()) //[object Object]

let obj = {
  name: 'jbee',
}
console.log(obj.toString()) //[object Object]

User.prototype[Symbol.toStringTag] = 'User'
Object.prototype[Symbol.toStringTag] = 'Obj'
console.log(user.toString()) //[object User]
console.log(obj.toString()) //[object Obj]
```

`new` 키워드를 통해 생성한 인스턴스와 `객체 리터럴`로 생성한 객체 둘 다 `[object Object]`라는 값으로 출력되기 때문에 구분하는 것이 어렵다. `toStringTag` 프로퍼티를 오버라이드하여 customize할 수 있다.

### Symbol.toPrimitive

```javascript
let values = [1, 2, 3]
let sum = values + 100
console.log(sum) //1,2,3100
console.log(typeof sum) //string
```

배열이 `string`으로 casting이 되고 그 뒤에 연산되는 `100` 마저 `string`으로 casting이 된다. 그래서 결과값이 `string`타입의 `1,2,3100`이 되는 것이다.

```javascript
//overriding
values[Symbol.toPrimitive] = function(hint) {
  console.log(hint)
  let result = 0
  for (let item of values) {
    result += item
  }
  return result
}

let sum2 = values + 100
console.log('sum2: ', sum2) //106
console.log(typeof sum2) //number
```

위 예제 코드에서는 `toPrimitive`라는 값을 통해서 배열의 값이 어떻게 반환될 지를 결정한다. 이 예제 코드에서는 배열의 모든 element 값을 더한 값으로 설정했다.
`hint`라는 값을 console로 찍어보기만 하고 아직 사용하지 않았는데, 이 `hint` 값을 통해서 어떠한 형태로 반환할 지 분기를 나눌 수 있다. 다음 코드를 살펴보자.

```javascript
let obj = {
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return 1
    }
    if (hint === 'string') {
      return '문자열'
    }
    return 'default'
  },
}

console.log('default: ', 100 + obj) //100default
console.log('number: ', 1 * obj) //number: 1
console.log(`string: ${obj}`) //string: 문자열
console.log(+obj + 1) //2
```

`[Symbol.toPrimitive]()`가 호출되면 자바스크립트 엔진은 parameter인 `hint`에 `number`, `string`, `default` 셋 중 하나를 설정하게 된다. 엔진은 어떻게 `hint`값을 설정할까? 네 개의 `console`을 찍어봤다.

1. `100 + obj`에서는 `obj`가 피연산자(연산 대상)이므로 `default`가 설정된다.
2. `1 * obj`에서는 `*`연산 때문에 `number`가 설정된다. (곱셈 말고도 뺄셈, 나눗셈도 `number`가 설정된다.)
3. `${obj}`에서는 `Template literal`로 사용되었으므로 `string`이 설정된다.
4. `+obj +1`에서는 `+`라는 단항 연산자가 `obj`앞에 붙어서 `number`가 설정된다.

### Symbol.isConcatSpreadable

`Array` 오브젝트의 `concat()`이라는 함수를 호출할 때의 상황을 지정하는 프로퍼티다. 두 배열을 결합할 때, 배열의 `펼침 여부`를 지정할 수 있다. `default value`는 `true`이다. 다음 예제 코드를 살펴보자.

```javascript
let prev = [1, 2]
let post = [3, 4]
console.log(prev.concat(post)) //[1, 2, 3, 4]

prev[Symbol.isConcatSpreadable] = false
console.log(prev.concat(post)) //[[1, 2], 3, 4]
post[Symbol.isConcatSpreadable] = false
console.log(prev.concat(post)) //[[1, 2], [3, 4]]
```

배열을 결합할 때, 펼치지 않고(프로퍼티 값을 `false`로 지정하고) 결합을 하게 되면, 배열의 구조를 그대로 유지하면서 합쳐진다. `Array-like` 오브젝트에서도 `concat()` 함수의 결과 형태를 지정할 수 있다.

### 정리

이 이외에도 `@@iterator`, `@@hasInstance`, `@@replace`, `@@species` 등 다양한 `Well-known Symbol`들이 존재한다. 이 `Well-known Symbol`들은 이미 ES5 스펙에서부터 존재했었고 자연스럽게 그것들을 사용해왔던 것이고 ES6에서 각 프로퍼티들을 오버라이드하여 좀 더 유연한 코드를 작성할 수 있게 끔 공개된 것이다.
_cf> `@@`은 `Symbol` 대신 사용할 수 있는 약자이다._

예제로 사용된 코드는 [Github Respository](https://github.com/JaeYeopHan/ECMAScript6_study)에서 확인하실 수 있습니다.

#### Symbol과 관련된 다른 글들

- [(ES6) Symbol - 양권성님 블로그 글](https://perfectacle.github.io/2017/04/16/ES6-Symbol/index.html)

_8. end_
