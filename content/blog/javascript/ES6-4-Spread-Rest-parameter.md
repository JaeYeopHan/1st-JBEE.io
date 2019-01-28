---
title: '[ES6] 4. Spread, Rest parameter'
date: 2017-04-18 20:59:13
category: 'javascript'
---

![](/images/javascript_es6.png)

# [ES6] 4. Spread, Rest parameter

## Spread

이터러블 오브젝트(Iterable object)의 엘리먼트를 하나씩 분리하여 전개한다. 전개한 결과를 변수에 할당하거나 호출하는 함수의 파라미터 값으로 사용할 수 있다.

```javascript
let prev = [3, 4]
let post = [7, 8]
let spreadObj = [1, 2, ...prev, 5, 6, ...post, 9]
console.log(spreadObj) // [1,2,3,4,5,6,7,8,9]
```

문자열도 가능하다.

```javascript
let sObj = [...'javascript']
console.log(sObj) // ["j", "a", "v", "a", "s", "c", "r", "i", "p", "t"]
```

## Rest Parameter

함수를 호출할 때 `spread` 연산자로 파라미터를 작성한 형태를 `Rest parameter`라고 한다. 함수안의 코드를 확인하지 않고도 호출문의 형태만 보더라도 `Rest parameter` 의 범위를 확인할 수 있어 가독성이 높아진다. 또한 `Rest parameter`는 `Array`, 즉 배열이므로 `Array` 오브젝트의 메서드를 사용할 수 있다. 그리고 `arrow funtion`에서도 사용 가능하다.

```javascript
let price = [12, 20, 18]
Math.max(12, 20, 18)
```

built in Object인 `Math`의 메소드 `max()`를 사용하기 위해서는 위 코드처럼 하나씩 넘겨줘야 한다.
또는 다음과 같은 방식을 사용했다.

```javascript
Math.max.apply(Math, price)
```

하지만 Rest parameter를 사용하면 보다 깔끔하게 작성할 수 있다.

```javascript
let maxPrice = Max.max(...price)
```

`Rest parameter`는 동적(dynamic)으로 생성된 파라미터라고 할 수 있기 때문에 함수의 `length`에서 포함되지 않는다. 기본적으로 함수의 `length` 프로퍼티는 파라미터의 개수를 의미한다.

```javascript
let getElementByRestWithParam = (param, ...rest) => {
  console.log(param)
  console.log(rest)
}
console.log(getElementByRestWithParam.length) // 1
```

위 `getElementByRestWithParam`메소드에 `spread operator`를 사용하여 인자를 넘겨보자.

```javascript
const values = [10, 20, 30]
getElementByRestWithParam(...values) //10 \n [20, 30]
```

`param`에 해당하는 인자가 따로받아지고 나머지 인자들은 `...rest`로 넘겨지면서 다시 배열로 넘겨지게 된다!

`Rest parameter`를 사용했을 때와 기존의 자바스크립트에서 `arguments`를 사용했을 때의 차이점을 살펴보기 위해 `arguments`에 대해서 잠깐 살펴보자. `arguments`는 `Array-Like Object`라는 공식 명칭을 하고 있는 유사 배열이다.

## Array-like Object(유사배열)

배열의 특징 중 하나는 index를 갖고 있어서 임의 접근(random access)가 가능하고, 그 index가 순차적으로 증가한다는 것이다. 만약 Object가 key값이 순차적으로 증가하는 값이고, 그에 따른 value가 존재한다고 했을 때, `Array-like Object`라고 한다.
배열의 인덱스 값을 프로퍼티 key 값으로 사용하는 것이다. 그리고 `length`라는 프로퍼티 값을 갖고 있어서 전개를 할 때는 다음과 같이 한다.

```javascript
// Array-like object
let arrLikeObj = {
  0: 'zero',
  1: 'one',
  2: 'two',
  length: 3,
}

for (let i = 0; i < arrLikeObj.length; i++) {
  console.log(arrLikeObj[i])
}
```

`Array-like Object`는 다음 두 가지 규칙을 모두 만족시켜야 한다.

1. 프로퍼티 값을 0부터 1씩 증가하면서 순차적으로 작성해야 한다.
2. length를 프로퍼티 키로 하여 전체 프로퍼티 수를 작성해야 한다.

### Rest parameter와 arguments의 차이

`arguments`도 `Array-like object`이기 때문에 `for statement`로 전개할 수 있다. 하지만 `Array` 오브젝트의 메서드를 사용할 수 없다. 이것이 치명적인 단점인 것이다. 또 `arrow function`에서는 `arguments`를 사용할 수 없다. 이것으로 미루어보아, ES6에서는 `arguments`를 사용하는 것을 최대한 자제하라는 느낌이다. 사실 `Rest parameter`에 익숙해지기만 하면 `arguments`를 통해 인자를 받는 것보다 유연한 코드를 작성할 수 있다.

한 가지 더 한계점을 지적하자면 `arguments`는 함수 내부를 봐야 어느 부분에서 `arguments` 객체를 사용하는지 알 수 있어 코드의 가독성이 떨어지게 된다. 그렇기 때문에 `arguments` 대신 `Rest parameter`를 도입한 것이다.

예제로 사용된 코드는 [Github Respository](https://github.com/JaeYeopHan/ECMAScript6_study)에서 확인하실 수 있습니다.

_4. end_
