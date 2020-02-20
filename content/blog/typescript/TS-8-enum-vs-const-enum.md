---
title: '[TS] 8. enum vs const enum'
date: 2018-06-16 15:02:44
category: 'typescript'
thumbnail: './images/typescript_banner.png'
---

![typescript_banner](./images/typescript_banner.png)

TypeScript 문법 중 `enum` 이라는 것이 있다. 주로 상수를 선언할 때 namespace 를 줘서 상수끼리의 응집도를 높이고 그 의미를 더할 수 있으며 VSCode 의 auto complete 의 지원을 받을 때 유용하다. 이 `enum` 키워드를 사용하는 방법에는 두 가지가 존재한다. 그냥 `enum` 키워드를 사용해 선언할 수 있으며 `const` 키워드와 함께 사용하여 `const enum`으로 선언할 수 있다.

이 두 가지는 무엇이 다를까.

[TypeScript Playground](http://www.typescriptlang.org/play/)에 가서 JavaScript 로 compile 된 모습을 먼저 살펴보자.

```typescript
enum JustEnumNumber {
  zero,
  one,
}

console.log(JustNumber.one) // 1
```

간단한 `enum` 을 선언했다. 이 `JustEnumNumber`는 다음과 같이 transpile 된다.

```javascript
var JustEnumNumber
;(function(JustEnumNumber) {
  JustEnumNumber[(JustEnumNumber['zero'] = 0)] = 'zero'
  JustEnumNumber[(JustEnumNumber['one'] = 1)] = 'one'
})(JustEnumNumber || (JustEnumNumber = {}))

console.log(JustNumber.one) // 1
```

`enum`에 대해 알아본 적이 있다면 익숙한 JavaScript 형태로 transpile 되는 것을 확인할 수 있다. 사실 저 코드는 조금 복잡해보여도 다음과 같은 코드이다.

```javascript
var JustEnumNumber
;(function(JustEnumNumber) {
  JustEnumNumber['zero'] = 0
  JustEnumNumber['one'] = 1
  JustEnumNumber[0] = 'zero'
  JustEnumNumber[1] = 'one'
})(JustEnumNumber || (JustEnumNumber = {}))
```

이젠 `const enum`을 보자.

```typescript
const enum ConstEnumNumber {
  zero,
  one,
}

console.log(ConstEnumNumber.one) // 1
```

아까와 같은 간단한 `enum`을 선언했고 플레이그라운드에서 JavaScript 도 transpile 을 해보자.

```Javascript
console.log(1 /* one */); // 1
```

`enum` 구현체는 다 사라지고 console 을 위한 코드만 남아있다. `const` 키워드를 사용하고 안 하고의 차이가 좀 큰 것 같다.

다시 ``JustEnumNumber`코드를 보자.`enum`만으로 선언할 경우, namespace 를 위한 변수가 선언이 된다.

```javascript
var JustEnumNumber
```

그리고 선언된 변수를 객체로 우리가 원하는 상수값들을 선언하게 된다. 이 때 선언된 변수는 transpile 되어서도 남아있게 되어 우리는 `enum`으로 선언한 객체 자체에 접근할 수 있다.

```typescript
console.log(JustEnumNumber) // [object object]
```

하지만 `const enum`으로 enum 을 선언하게 되면 compile 단계에서 namespace 가 날라가게 되므로 접근할 수 없다.

```typescript
console.log(ConstEnumNumber) // [ERROR] 'const' enums can only be used in property or index access expressions or the right hand side of an import declaration or export assignment or type query.
```

내부 상수값들이 전부 compile 단계에서 대치된 것이다. 내부 필드를 전부 상수로 변경하기 때문에 런타임에 의존 모듈의 영향을 받지 않게 되며, 코드 크기가 더 적기 때문에 더 선호된다고 한다.

사실 이 부분은 TypeScript Official Document 에 다음과 같이 나와있다.

> To avoid paying the cost of extra generated code and additional indirection when accessing enum values, it’s possible to use `const` enums.

그렇다면 `enum`만으로 선언하는 경우는 언제일까.

우선 namespace 가 남아있으니 우리는 enum 을 이렇게도 사용할 수 있다.

```typescript
console.log(JustEnumNumber[JustEnumNumber.one]) // one
```

상수만으로 로그가 찍히면 알아보기 힘드니 reverse 참조를 하여 로그를 찍을 수 있다. lookup object 로 사용하는 것이다. 하지만 이렇게 선언된 enum은 런타임에 이 lookup object 를 통해 참조가 이루어지므로 조심해야 한다. 물론 webpack 환경에서는

```javascript
(function(module, exports, __webpack_require__) {
  // ...
}
```

이렇게 scope 를 쳐주지만 test 환경에서는 browser 객체(ex. window...)를 참조하는 경우 에러가 발생할 수 있다.

참고한 블로그의 문장을 인용하여 해당 글을 마친다.

> `const enum` is a **compile-time only** feature, while the original `enum` is a **runtime + compile-time**feature. Most projects will be well suited for `const enum`, but there may be cases where `enum` is preferred.

### Reference

- https://www.typescriptlang.org/docs/handbook/enums.html
- https://www.sitepoint.com/10-essential-typescript-tips-tricks-angular/?WT.mc_id=link-twitter-jeliknes
