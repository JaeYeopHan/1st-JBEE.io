---
title: 'FrontEnd Application에서 Null 다루기'
date: 2020-04-03 15:04:28
category: react
thumbnail: './images/react-data-null-handling.png'
draft: false
---

![react-data-null-handling](./images/react-data-null-handling.png)

`null`을 어떻게 하면 잘 다룰 수 있을까. NPE(Null Pointer Exception) 그리고 자바스크립트 개발자에게는 URE(Undefined Reference Exception)을 자주 마주한다.

| URE 는 지어낸 이름이다.

### Table of Contents

- null vs undefined
- NPE
- Prevent, Handle
  1. 초기화를 명확히
  2. 존재할 수 있는 범위를 제한
  3. 빈 반환값 사용
- 마무리

## null vs undefined

JavaScript에는 `null`과 별개로 `undefined`라는 것이 존재한다. null은 메모리 자체가 할당되지 않았음을 의미하며 `undefined`는 메모리가 할당되었지만 값이 할당되지 않았음을 의미한다.

때문에 일반적으로 `null`은 의도적으로 값이 없는 것을 의미하며, `undefined`는 의도하지 않게 값이 없는 것을 의미한다. 이 section에서는 null과 undefined를 별도로 구분하지 않고 null이라 통일하여 작성했다.

## NPE

TypeScript를 사용한다면 컴파일 단계에서 어느정도 다룰 수 있다. Non-nullable로 정의된 변수나 프로퍼티에 접근하기 전에 해당 값이 **'비어있는지'** 확인해야만 하기 때문이다.

하지만 TypeScript도 모든 문제를 해결해주진 않는다. 다음 코드를 살펴보자.

```ts
// in react component
const state = useSelector((state: RootState) => state[TRANSFER])
const dueDate = state.sender.transferInfo.dueDate
```

dot(`.`)으로 접근하는 부분이 세 군데나 존재한다. TypeScript를 통해 각각의 값은 Required property로 지정해두었기 때문에 무리없이 접근할 수 있다. 그런데 이 중 `sender` 또는 `transferInfo`에 대한 값이 서버에서부터 전달되는 값이라서 **null이 될 가능성이 존재하는 값**이라면 어떻게 될까.

리액트 컴포넌트에서는 해당 값에 접근할 것이고 컴포넌트는 에러를 뱉을 것이다. 당연히 HTTP Request가 이루어지고 있는 단계(예를 들면 [axios의 interceptor](https://github.com/axios/axios#interceptors))에서 에러 처리가 이루어져야 정상이겠지만 **어디서든 `null`을 참조할 수 있을 것**이라는 이야기를 하고 싶었다.

## Prevent, Handle

컴파일 단계에서 할 수 있는 것과 런타임 단계에서 할 수 있는 것을 나누어 생각해볼 수 있다.

### 1. 초기화를 명확히

보통 Redux를 사용하는 경우`initialState`를 통해 그 상태를 초기화한다. 이 때 non-nullable 값으로 초기화해줄 수 있다. 배열 타입의 상태라면 빈 배열을, 객체 타입의 상태라면 빈 객체로 초기화시켜준다.

```ts
const initialState: PostState = {
  posts: {},
  ids: [],
}
```

`string`, `number`와 같은 primitive type에 대한 값은 어떻게 초기화시켜줘야 할까? 이는 프로젝트에서 운영하는 정책에 따라 달라질 수 있는 부분이라고 생각된다.

만약 null로 지정한다면 다음과 같은 이슈가 발생한다.

```ts
type Mayby<T> = T | null
```

즉, 각 상태들이 `null`일 가능성이 존재하기 되는 것이다. 때문에 값에 안전하게(safety) 접근하기 위해서는 optional chaining 등의 syntax를 활용하여 접근해야 한다.

`0` 또는 Empty string(`''`)을 초기값으로 설정한다면 어떻게 될까? 실제 값이 `0`일 수도 있고, 실제 값이 빈 문자열 (`''`)인 상황 즉, 올바른 값이지만 올바른 값이 아니라고 판단하게 되는 경우가 발생할 수 있다.

둘 다 장단점(trade-off)이 있기 때문에 어느 하나를 정책으로 정한 후, 프로젝트 내에서 **일관성 있게** 적용을 해야 한다.

### 2. 존재할 수 있는 범위를 제한

`null`이 존재할 수 있는 범위를 store 레벨 또는 custom hooks로 **제한**하는 방법이다. 즉 비즈니스 로직이 위치하기 위한 공간으로 그 범위를 제한하는 것이다. component에서 store에 접근하여 특정 값을 접근하려고 할 때, 별도의 Null check condition이 **필요없도록** store 레벨에서 null이 발생할 수 있는 경우를 모두 처리하는 방법이다.

컴포넌트는 화면을 구성하고 View를 그린다(render). 따라서 데이터에 대한 유효성 검사를 별도 로직으로 분리하는 방향을 생각해볼 수 있다.

```ts
// in react component
const state = useSelector((state: RootState) => state[TRANSFER])
const dueDate = state.sender.transferInfo.dueDate // Don't care about this!
```

위의 예제에서 `dueDate` 값을 참조할 때, `null`일 가능성은 이미 상태 관리 레벨에서 이루여졌기 때문에 컴포넌트 레벨에서는 아무 위험(risk)없이 값에 접근할 수 있게 되고 컴포넌트를 구성하는 코드도 깔끔해진다.

### 3. 빈 반환값 사용

[tc39에 optional-chaining이라는 Spec](https://github.com/tc39/proposal-optional-chaining)이 있다. 현재 Stage 4이며 표준이 되었다고 볼 수 있다. TypeScript에서는 3.7.x version에서부터 지원이 되어왔고 [ts-optchain](https://github.com/rimeto/ts-optchain) 이라는 유틸 라이브러리를 통해서 목적하고자 하는 **'안전한 참조'**를 이룰 수 있었다.

```ts
if (state && state.sender && state.sender.transferInfo && ...)
```

객체의 프로퍼티에 안전하게 접근하기 위해 위와 같은 조건문을 작성했다면 optional chaining syntax 또는 ts-optchain 라이브러리를 이용하여 다음과 같이 작성할 수 있다.

```ts
// with optional chaining syntax
const dueDate = state?.sender?.transferInfo?.dueDate
// with ts-optchain
const dueDate = oc(state).sender.transferInfo.dueDate
```

이 안전한 참조의 경우 정말 안전할까? 접근하는 동안에는 NPE가 발생하지 않고 `dueDate`에는 `undefined` 값이 할당되겠지만 이것은 안전하지 않다. 만약 다음과 같은 코드가 있다면 어떻게 될까.

```ts
function format(text: string) {
  return text.length > 10 ? 'Over' : text
}
format(dueDate)
```

Optional Chaining Syntax에 의해 `undefined`가 할당된 dueDate가 `string` 타입일 경우를 가정하고 작성된 format util로 전달된 상황이다. `undefined` 값에 `length` 프로퍼티를 접근하다가 에러가 발생하여 애플리케이션은 빨간 피를 토할 것이다.

이런 경우를 대비하여 안전한 참조를 할 경우, **빈 반환값**을 함께 사용해야 한다.

'빈 반환값'이란 아무일도 하지 않는 객체, 즉 **일종의 더미 데이터 값**을 의미한다. 반환해야 하는 타입과 동일한 타입의 더미 객체를 만들어두고 `undefined`를 할당해야하는 경우 그 값을 반환한다.

```ts
// with optional chaining syntax
const dueDate = state?.sender?.transferInfo?.dueDate || ''
// with ts-optchain
const dueDate = oc(state).sender.transferInfo.dueDate('')
```

위 예제 코드에서는 `string` 타입의 빈 반환값이 필요하여 빈 문자열(`''`)을 반환하였다. 객체의 경우 다음과 같이 진행할 수 있다.

```ts
const EmptyTransferInfo: TransferInfoType = { ... }
const transferInfo = state?.sender?.transferInfo || EmptyTransferInfo
```

빈 반환값 대신 의도적으로 `null`을 반환하도록 할 수도 있다. 그러나 이 방법은 `null`이 존재할 수 있는 범위를 확장하는 것이기 때문에 `null` 인지 판단하는 코드가 여러 번 작성될 가능성이 있다.

빈 반환값으로 반환하면 모든 문제가 해결될까? 이 빈 객체는 브라우저에서 JavaScript 로직 상 에러가 발생하지 않도록 처리하기 위함이다. 그렇다면 이 에러는 어떻게 알고 사용자에게 어떻게 알려줄지 고민을 해야 한다.

React에는 [Error Boundary](https://reactjs.org/docs/error-boundaries.html) 라는 spec이 있다. 그리고 JavaScript에는 `try-catch` statement가 있다. 이 또한 프로젝트 내에서 정책을 정해 일관되게 적용하여 보다 안전한 코드를 작성할 수 있다.

## 마무리

일관되고 안전한 코드를 작성하기 위해서는 여러 에러 처리들을 고민해야 한다. 그 중 자주 만날 수 있는 `null` 참조 에러를 어떻게 사전에 조금이라도 방지할 수 있을지 그 고민들을 정리해봤다.

### References

- [https://www.freecodecamp.org/news/avoiding-null-check-pollution-in-javascript-4ed8e2702ce3/](https://www.freecodecamp.org/news/avoiding-null-check-pollution-in-javascript-4ed8e2702ce3/) (thumbnail image)
