---
title: '[ES6] 2. Arrow function'
date: 2017-04-18 13:51:49
category: 'javascript'
---

![](/images/javascript_es6.png)

> Always apply to 'Anonymous function’

### 자바스크립트의 Scope

자바스크립트에서 생성자 함수를 통해 객체를 생성하면 변수 scope가 변경된다. 즉, 생성자 함수 내부에서의 this는 자신을 호출한 대상이 아닌 생성자 함수를 가리키게 된다. 생성자 함수를 통해 생성되는 객체의 과정 때문이다. 그래서 우리는 여태껏 별의 별짓을 다해왔다. `self`며 `bind`며 jQuery에서는 `proxy`라는 녀석도 사용했다.

### 새로운 function의 등장

하지만 이제는 새로 도입된 Arrow function 을 사용하여 변수 스코프를 보존하자. Arrow function를 통해서 함수를 정의하게 되면, 변수들이 사용되는 위치와는 상관없이 변수들이 정의되어 있는 값으로 scope가 binding 된다. 한 가지 특징을 덧붙이자면, arrow function을 사용하게 되면 `arguments` 객체가 생성되지 않는다. 하지만 우리는 ES6 문법을 사용하는 이상, `arguments`는 필요하지 않다!

### Arrow function Rule

ES6의 arrow function에는 몇 가지 규칙이 존재하며 대부분의 `lamda`에서도 비슷한 규칙을 가지고 있어서 `lamda`를 사용해본 경험이 있다면 어색하지 않을 것이다.

1. Parameter와 화살표 사이에서 개행할 수 없다.
2. Parameter가 하나일 때는 괄호를 생략할 수 있다.
3. Parameter가 없으면 소괄호( ( ) )만 작성한다.
4. Block scope({ })를 지정하지 않고 한 줄로 arrow function을 사용할 때는 return이 생략될 수 있다.
5. 그 반대로 block scope를 사용한다면 return을 명시해줘야 한다.

### Arrow Function은 this를 bind하지 않는다!

```javascript
//ES5
document.getElementById('todos').addEventListener('click', function() {
  console.log(this) //#todos
})
//ES6
document.getElementById('todos').addEventListener('click', () => {
  console.log(this) //Window
})
```

### this의 정체

ES5에서 `this` 결정되는 세 가지 조건을 짚고 넘어가자.

1. 생성자 내에서
   생성자 함수를 `new`라는 키워드를 통해 호출하면 내부에서 `this`는 인스턴스 그 자체를 가리킨다. 생성자 함수 내부에서 `return this;`가 생략되어 있기 때문이다.
2. 함수 내에서
   `this`는 생략된 매개 변수이다. 무엇이 함수를 호출했는가가 `this`를 결정한다.
3. `bind`, `apply`, `call` method or `proxy` method of jQuery
   `this`는 메소드로 바꿔준 대상을 가리키게 된다.

> 그렇다면 arrow function 내에서 `this`는 무엇을 가리키는가.

해당 function을 정의한 영역의 `this`를 가져온다. 한 단계 더 위의 `element`를 가리키는 것이다. 그렇기 때문에 `prototype`에 함수를 정의할 때 arrow function을 사용할 때 내부적으로 `this`를 사용하게 되면 객체를 가리키지 않고 `window` 객체를 가리키게 된다. 또한 arrow function은 명식적으로 `bind`, `call`로 `this`를 넣어줘도 이를 무시한다.

ES6의 arrow function은 단순히 함수를 간단하게 작성할 수 있는 문법이 아니다. 기존의 방식대로 function을 작성해야만 의도대로 작동하는 function이 존재할 수 있고, arrow function으로 기존의 function을 작성하던 방식보다 편하게 작성할 수 있게 된 것이다. 두 가지 방식의 차이점을 제대로 이해하고 새로운 문법과 기존의 문법을 적재적소에서 사용하는 것이 중요해졌다.

예제로 사용된 코드는 [Github Respository](https://github.com/JaeYeopHan/ECMAScript6_study)에서 확인하실 수 있습니다.

_2. end_
