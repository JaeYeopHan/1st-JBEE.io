---
title: '[ES6] 5. Destructuring and Default Parameter'
date: 2017-04-18 20:59:34
category: 'javascript'
---

![](/images/javascript_es6.png)

## Destructuring

`shorthand` 방식을 이용하여 함수의 반환값을 **바로 객체에 할당**할 수 있다. 이 때 함수에서 반환되는 **프로퍼티 값**과 **지역 변수**의 이름이 같아야 가능하다. 이렇게 하면 함수의 반환 값을 **임시 객체에 저장**하고 그 객체의 프로퍼티를 통해 접근하여 지역 변수에 할당하는 과정을 축소할 수 있다. 굳이 전체를 객체에 할당하지 않고 부분적으로만 할당도 가능하다. 즉, 리턴되는 값이 객체일 경우, 그 객체를 분해하여 바로 지역변수로 접근이 가능하다는 것이다. (iterable protocol을 구현해야만 destructuring이 가능하다.)

```javascript
function buildUser(first, last) {
  let fullName = first + ' ' + last
  return { first, last, fullName }
}
let { first, last, fullName } = buildUser('Sam', 'Williams')

console.log(first) // Sam
console.log(last) // Williams
console.log(fullName) // Sam Williams
```

굳이 전체를 객체에 할당하지 않고 부분적으로만 할당도 가능하다.

```javascript
let { fullName } = buildUser('Sam', 'Williams')
console.log(fullName) // Sam Williams
```

### Method Initializer Shorthand

객체에 함수를 추가할 때, 객체의 프로퍼티에 익명 함수를 추가하는 방식을 사용했다. ES6에서는 메소드를 활용한다. 비교를 위해 ES5도 함께 제시한다.
_ES5code>>_

```javascript
function buildUser(first, last, postCount) {
  return {
    isActive: function() {
      //...
    },
  }
}
```

_ES6code>>_

```javascript
function buildUser(first, last, postCount) {
  return {
    isActive() {
      //...
    },
  }
}
```

### Destructuring Assignment

오른쪽의 배열을 분할하여 왼쪽 변수에 값을 `할당`한다. 인덱스 번째의 엘리먼트 값을 인덱스 번째의 변수에 할당하는 것이다. 엘리먼트가 아직 남았는데 할당할 변수가 없다면 그대로 할당되지 않고, 엘리먼트가 남지 않았는데 할당한 변수가 있다면 그 변수는 `undefined`로 할당된다.

```javascript
let one,
  two,
  three,
  four
  //case1
;[one, two] = [1, 2]
console.log(one) //1
console.log(two) //2
//case2
;[one, two, three] = [1, 2]
console.log(one) //1
console.log(two) //2
console.log(three) //undefined
//case3
;[one, two] = [1, 2, 3]
console.log(one)
two //1
console.log(two) //2
```

이전 Chapter에서 다뤘던 `Spread` 연산자를 사용할 수 있으며, 공백으로 두어 해당 값을 건너 뛰고 `할당`할 수 있다.

```javascript
;[one, ...other] = [1, 23, 24, 25]
console.log(one) //1
console.log(other) //[23, 24, 25]
;[one, , , four] = [1, 2, 3, 4]
console.log(one) //1
console.log(four) //4
```

## Default Value

`destructuring`을 통해 값을 할당할 때, 해당하는 값이 없을 때, `undefined` 대신 할당할 default value를 지정해줄 수 있다.

```javascript
let [first, second, third = 3] = [1, 2]
console.log(first) //1 by destructuring
console.log(second) //2 by destructuring
console.log(third) //3 by default value

let [fourth, fifth, sixth = 6] = [4, 5, 66]
console.log(fourth) //4 by destructuring
console.log(fifth) //5 by destructuring
console.log(sixth) //66 by destructuring
```

## Default Parameter

parameter에 값이 넘어가지 않아도, default value로 설정된 값이 해당 파라미터 대신 값이 할당된다. parameter에서도 마찬가지로 기존의 default value는 `undefined` 값이었지만, 그 값을 코드 상에서 설정할 수 있게 된 것이다.

```javascript
let somethingFunction = (prev, post = 20) => prev + post
console.log(somethingFunction(1)) //21 by default parameter
console.log(somethingFunction(1, 2)) //3
console.log(somethingFunction(1, undefined)) //21 by default parameter
console.log(somethingFunction(1, null)) //1
```

함수에도 `length`라는 `property`가 따로 존재한다. 그런데 이 때, `default parameter`는 `length`에서 무시된다.

```javascript
getTotal(100) //1
getTotal(100, 0.05) //2
console.log(getTotal.length) //1
```

예제로 사용된 코드는 [Github Respository](https://github.com/JaeYeopHan/ECMAScript6_study)에서 확인하실 수 있습니다.

_5. end_
