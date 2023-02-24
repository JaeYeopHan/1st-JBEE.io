---
title: '좋은 테스트 코드와 의존성'
date: 2022-11-21 11:01:12
category: developments
thumbnail: './images/swe-resume.jpg'
draft: true
---

이전 글 > 테스트에 대한 오해와 사실

**Table of contents**

- 좋은 테스트 코드
- 프론트엔드 테스트는 왜 어려울까?
- 의존성

## 좋은 테스트 코드

### 1. 구현 대신 기능을 검증한다.

- 변하는 것은 구현.
- 기능을 검증하면 테스트가 깨지지 않는다.
- 기능이 변경되면 테스트 코드를 먼저 수정하고 깨진 테스트를 고치기 위해 구현 코드를 수정한다.

### 2. mock 사용을 '지양'한다.

- 외부와 분리할 수 있다는 장점이 있지만 구현과 강하게 결합되어 있기 때문에 깨지기 쉽다.

### 3. 테스트 케이스만 보고 테스트를 이해할 수 있도록 작성한다.

- 테스트 케이스간 공유하는 객체를 만들지 않는다.
    - 대신 함수로 만들자.
- 전후 맥락이 필요한 테스트 케이스를 만들지 않는다.
    - 제품 코드에서 export 되는 상수를 참조하여 작성하지 말자.

### 4. 상태를 테스트한다.

- 상호작용 대신 상태를 테스트 한다.
- 상태를 테스트하는 것보다 출력을 테스트하는 것이 더 좋다.

## 프론트엔드 테스트는 왜 어려울까?

1. 제품이 돌아가는 환경과 테스트 코드가 돌아가는 환경이 다르다.
    1. node vs browser
2. 많이 작성해보지 않았다. (~~공부를 안했다.~~)
3. 테스트 대역이 많이 필요하다.
    1. 프론트엔드 애플리케이션은 기본적으로 수많은 “것”에 **의존**을 하고 있음. (추후 더 다룰 예정)


## 테스트 대역

테스트 케이스를 수행하는데 외부 의존성을 대체하기 위한 수단을 일컫는 말

### 프론트엔드 테스트가 어려웠던 이유 중

제품이 돌아가는 환경과 테스트 코드가 돌아가는 환경이 다르다. (node vs browser)

→ browser라는 ‘의존성', 기능을 제공하는 **외부 의존성**이 있어서 어려웠던 것이다.

*→ 브라우저라는 런타임을 주입받아야 하는가?*

> JavaScript 언어는 몽키패칭하기 쉽다. (`jest.mock`)

## 의존성이란?

> 사전 그대로 받아들이면 이해하기 어려운 용어
> 

`의존`+`성`

- 의존하다.
    - A가 B에 의존한다.
        - A가 B의 기능을 사용한다.
        - A가 B에게 어떠한 일을 해달라고 요청한다.
    
    === 기능을 사용한다.
    
    === 메세지를 보낸다.
    
- ‘왜 그것에 의존하는가?’로 접근을 해야 ‘의존성'을 이해할 수 있다.
    - 나의 역할이 아니고 그 역할을 수행하는 적임자가 있기 때문.
- 의존성
    - 기능을 제공하는 주체
    - OOO을 제공하는 주체
    
    ⇒ 서비스? 런타임?
    

### 프론트엔드 앱에서의 의존성

- Browser Runtime API (Web API) → `window.*`
    - alert, confirm
    - local storage, session storage
    - setTimeout
    - …
- DOM (Document Object Model) → `document.*`
    - querySelector
    - addEventListener
    - …
- 데이터를 주고 받는 외부의 무언가
    - 서버 (네트워크를 통해 통신)

### 의존성 주입

![주입의 정의](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0ffcaa88-6948-4c0e-9a01-abb8a883694c/Untitled.png)

주입의 정의

- 기능을 제공하는 주체를 넣어준다. (앱에)
- 주입한다는 것은 **객체의 생성과 사용**의 관심을 **분리**하는 것을 말한다.
    - 생성: 기능을 제공할 수 있도록 준비하는 단계
    - 사용: 앱에서 제공하는 기능을 사용하는 것을 말한다.

> 이게 테스트랑 무슨 상관?
> 

**주입받는다는 것은?**

1. A에서 b에 직접적으로 의존할 필요가 없다.
    1. 의존하는 이유가 b에서 제공하는 기능이었으니
    2. b라는 기능을 제공하는 무언가만 있으면 된다.
    3. 사실 A입장에서 b인지 아닌지는 중요하지 않고 **b에게 요청할 기능, 메세지**가 중요했다.
        
        → 우리는 이것을 인터페이스(또는 계약)라고 부를 수 있다. ⇒ M
        
2. 정의한 인터페이스를 기준으로 A는 자신의 역할을 수행한다.
3. 상황에 맞게 M을 생성하고 A에 주입해줄 수 있다.

#### 예제 (***LogProvider + LogClient)***

**1) 직접적으로 의존하는 경우**

```jsx
import LogClient from '@logging-sdk/core';
import { useEffect } from 'react';

function ServicePage() {
  useEffect(() => {
    LogClient.log(...)
  }, [])

  return <div>...</div>
}
```

<aside>
⚠️ `import` 는 직접적으로 의존함을 의미한다.

</aside>

- `ServicePage` 라는 컴포넌트는 `LogClient`에 직접적으로 의존한다.
- 만약 테스트를 한다면?
    - `LogClient.log` 의 구현이 **외부에 의존하고 있을 경우** 테스트하기 어렵다.

**2) 의존성을 주입받는 경우**

DI 구현을 위해 Context API와 hooks를 사용해보자.

***ServicePage.tsx***

```jsx
import { useLogClient } from '@logging-sdk/react';
import { useEffect } from 'react';

function ServicePage() {
  const client = useLogClient();

  useEffect(() => {
    client.log(...)
  }, [])

  return <div>...</div>
}
```

- LogClient의 존재에 대해 알지 못한다!

***App.tsx***

```jsx
function App() {
  return (
    <LogProvider client={new LogClient()}>
      <ServicePage />
    </LogProvider>
  );
}
```

- 외부에서 `LogClient`를 생성하고 주입!

***ServicePage.test.tsx***

```jsx
test('ServicePage 가 렌더링되면 Screen 로깅을 한다.', () => {
  const logClient = new DebugLogClient();

  render(<ServicePage />, {
    wrapper: ({children}) => {
      return <LogProvider client={logClient}>{children}</LogProvider>
    }
  })
});
```

***LogProvider.tsx***

```jsx
import LogClient from '@logging-sdk/core'; // ??

interface Props {
  client: LogClient; // FIXME
  children: ReactNode;
}

export function LogProvider({ client, children }: Props) {
  return <LogContext.Provider value={{ client }}>{children}</LogContext.Provider>;
}
```

***LogClient.tsx***

```jsx
interface LogClientSpec {
  log: (...) => void;
}

export class LogClient implements LogClientSpec {}

export class DebugLogClient implements LogClientSpec {}
```

```jsx
import { LogClientSpec } from '@logging-sdk/core'; // ??

interface Props {
  client: LogClientSpec;
  children: ReactNode;
}

export function LogProvider({ client, children }: Props) {
  return <LogContext.Provider value={{ client }}>{children}</LogContext.Provider>;
}
```
