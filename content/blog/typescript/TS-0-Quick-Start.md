---
title: '[TS] 0. Quick Start'
date: 2017-04-19 13:49:15
category: 'typescript'
thumbnail: './images/typescript_banner.png'
---

![typescript_banner](./images/typescript_banner.png)

이 포스팅은 TypeScript Official Document를 참고하여 작성한 자료입니다. 직접 타이핑 해본 결과 5분정도 소요되는 짧은 Quick start 입니다:) 가볍게 봐주세요.

## Install TypeScript

npm을 통해서 간단하게 TypeScript를 설치할 수 있습니다. VSCode 등 타입스크립트를 지원하는 에디터에서는 플러그인을 통해서 설치가 가능합니다.

via npm

```bash
$ npm install -g typescript
```

command를 이용하여 또는 Editor를 열어 `greeter.ts`라는 파일을 만듭니다.

```bash
$ touch greeter.ts
```

`greeter.ts`코드는 다음과 같습니다.

```typescript
function greeter(person) {
  return 'Hello, ' + person
}

var user = 'Jane User'

document.body.innerHTML = greeter(user)
```

TypeScript는 `.ts`라는 확장자를 사용합니다. 이 파일은 컴파일되어 `greeter.js`파일이 됩니다.

```bash
tsc greeter.ts
```

`tsc`라는 명령어를 통해서 TypeScript로 작성된 파일을 컴파일할 수 있습니다.
현재 `greeter.ts`에 작성되어있는 코드는 기존의 JavaScript와 다를 바가 없습니다. 이 JavaScript code인 `greeter.ts`에 TypeScript 문법을 하나씩 추가해보겠습니다.

## TypeScript가 제공하는 대표적인 기능

### Type annotations

동적으로 변수의 타입을 결정했던 JavaScript에게 타입이 생겼습니다.

```typescript
function greeter(person: string) {
  //...
}
```

**TypeScript**는 Type을 제공합니다. Type annotations는 함수가 받는 parameter에 타입을 지정해주어, 함수 내부에서 별도의 타입 체크 없이 parameter를 사용할 수 있게 해줍니다. 즉, `person`에 다른 타입의 parameter가 주어지면 error가 발생하게 됩니다.

```typescript
function greeter(person: string) {
  return 'Hello, ' + person
}

var user = [0, 1, 2]

document.body.innerHTML = greeter(user)
```

error:

```js
greeter.ts(7,26): Supplied parameters do not match any signature of call target
```

타입스크립트는 코드의 구조와 작성된 `type annotation`으로 정적 분석을 제공합니다. 위와 같이 error가 발생하더라도 타입스크립트 파일은 컴파일되어 `.js`파일을 만들게 됩니다. TypeScript의 역할은 제대로 동작하지 않을 것 같은 코드에 대해 개발자에게 `warning`해주는 역할이라고 생각해도 될 것 같습니다 :)

### Interface

Java개발자라면 익숙한 `interface` 문법입니다. 위에서 사용했던 예제를 `interface`를 사용하여 확장해보겠습니다.

```typescript
interface Person {
  firstName: string
  lastName: string
}

function greeter(person: Person) {
  return 'Hello, ' + person.firstName + ' ' + person.lastName
}

var user = { firstName: 'Jane', lastName: 'User' }

document.body.innerHTML = greeter(user)
```

함수의 parameter에 `String`이라는 타입 대신 인터페이스(interface)를 적용했습니다. Java의 Generic과 비슷하게 보이는데요, interface를 사용하여 함수가 넘겨받는 parameter의 타입을 보다 구체적으로 정의할 수 있게 되었습니다. 위의 예제 코드와 마찬가지로 정의된 type과 맞지 않은 type의 parameter가 전달되면 error를 출력합니다.

### Class

ES6(ECMAScript2015)에서부터 추가된 `Class` 문법입니다.

```typescript
class Student {
  fullName: string
  constructor(public firstName, public middleInitial, public lastName) {
    this.fullName = firstName + ' ' + middleInitial + ' ' + lastName
  }
}
var user = new Student('Jane', 'M.', 'User')
```

ES6의 `Class`와는 약간 다른 모습을 보입니다. 바로 Class 내부에서 `field member`를 갖게 된 것입니다. 하지만 그 근본은 ES6의 `Class`와 같습니다. JavaScript에서 프로토타입을 통해 구현했던 OOP를 보다 간결한 방법으로 문법을 제공하는 것입니다.

공식 문서에서 제공하는 Quick Start를 통해서 TypeScript 맛보기를 해봤습니다. 감사합니다.
