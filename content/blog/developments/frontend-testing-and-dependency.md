---
title: '프론트엔드 테스트 코드와 의존성'
date: 2023-06-09 11:01:12
category: developments
thumbnail: './images/frontend-testing-and-dependency.jpg'
draft: true
---

![frontend-testing-and-dependency](./images/frontend-testing-and-dependency.jpg)

이전 글 > [테스트에 대한 오해와 사실](https://jbee.io/developments/misconception-and-facts-about-testing/)

**Table of contents**

- 프론트엔드 테스트는 왜 어려울까?
- 의존성
- 프론트엔드 앱에서의 의존성

## 들어가며

테스트 코드를 작성하기도 전에 테스트 환경을 준비하다가 지친 경험은 누구나 한번쯤 있을 것이다. TypeScript부터 시작해서 온갖 모듈들의 서커스를 하고 나서 테스트 코드를 작성할 수 있게 된다. 환경을 다 구축하고 나서 비즈니스 로직에 대해 테스트를 작성하려고 하면 뭐가 그렇게 실패하는 이유가 다양한지 실제로 테스트 코드를 하나 통과시키는데 여정이 험난하다. 왜 프론트엔드 테스팅 환경이 복잡한지 이유 중 일부분을 이번 글을 통해 설명해보려고 한다.

## 프론트엔드 테스트 코드는 왜 작성하기 어려울까?

사칙연산처럼 단순한 코드를 테스트하는 것은 쉬운데, 컴포넌트 테스트는 왜 이렇게 자꾸 복잡해지는 것일까.

### 1. 제품이 동작하는 환경과 테스트 코드가 실행되는 환경이 다르다.

| Node.js vs Browser

우리가 작성한 React 웹 애플리케이션은 대부분 브라우저에서 동작하길 기대하고 작성한다. DOM에 접근하거나 window에 접근하는 것이 이를 말해준다. 그러나 jest를 사용하여 작성한 테스트 코드는 브라우저 위에서 동작하지 않는다. 터미널, 즉 Node.js 환경에서 동작한다. 이 런타임(환경)의 차이가 작은 것 같지만 큰 차이를 만들어 내면서 테스트 코드 작성을 어렵게 만든다. (스포일러: Node.js엔 Document Object Model이 없다.)

### 2. 기본적으로 수많은 것에 '의존'하고 있다.

테스트 코드를 작성할 때, 챙겨야 하는 것이 많으면 작성하기 쉽지 않다. 마치 여행을 가려고 하는데, 혼자 여행갈 때와 가족이 여행갈 때 챙겨야 하는게 다른 것과 마찬가지이다. 내 준비물 뿐만 아니라 반려동물의 준비물, 자녀의 준비물을 모두 신경쓰면서 여행가긴 쉽지 않다. 무언가에 '의존한다'라는 것을 챙겨야 하는 것이라고 비유해볼 수 있다. 프론트엔드 애플리케이션은 기본적으로 여러 가지에 의존하고 있다. 무엇에 의존하고 있는지 살펴보자.

## 의존성

의존성이라는 단어는 들어봤는데, 그래서 그게 무엇인지 대답하긴 어렵다. 앞서 챙겨야 한다고 비유를 했는데, 과연 의존성이란 무엇일까? 주어진 상황에 따라 다르게 해석되는 이 단어의 실체를 파악하고 정의한 다음, 어떤 문제를 야기하는지 살펴보자. 

사전 그대로 받아들이면 이해하기 어려운 용어이기 때문에 소프트웨어 개발 관점에서 쉽게 풀어보려고 한다.

'의존한다.' 라는 것은 'A가 B에 의존한다.'처럼 어떤 객체간의 관계를 의미하게 된다. 독립적인 행동이 아닌, 둘 이상 객체간의 현상을 말한다. 그렇다면 현상이 발생한 **원인**에  접근해야 비로소 ‘의존성'을 이해할 수 있다.

> 왜 그것에 의존하는가?

내가 누군가에게 아쉬운 소리를 왜 하는가 되돌아봤을 때, 내가 가지고 있지 않은 무언가를 얻기 위해 아쉬운 소리를 하곤 한다. 내가 모든 것을 할 수 없고 모든 것을 가질 수는 없기 때문이다. 두 객체간도 마찬가지이다. 객체의 **역할이 나뉘어져 있기 때문에** 자신에게 기능이 없고 그 기능을 수행하는 적임자가 있기 때문에 그 적임자에게 **의존**하게 된다.

결과적으로 의존성은 무엇을 **제공**하는 주체라고 할 수 있다. 그 무엇은 상황에 따라 달라질 수 있는데 어떤 **기능**이 될 수도 있고 서비스, 더 나아가 제품이 동작할 **환경(런타임)**이 될 수도 있다.

즉, 'A가 B에 의존한다.'라는 문장을 앞선 정의에 따라 이해하기 쉬운 말로 표현해보면 다음과 같이 풀어볼 수 있다.

- A가 B의 기능, 서비스를 사용한다.
- A가 B에게 어떠한 일을 해달라고 요청한다.

## 프론트엔드 앱에서의 의존성

그렇다면 구체적으로 프론트엔드 애플리케이션에서 의존하고 있는 것들, 즉 의존성은 무엇이 있을까? 앞서 이야기한 것처럼 Browser 환경을 기반으로 작성되기 때문에 DOM과 같은 '환경'에 암묵적으로 의존하고 있다고 할 수 있다.

우리가 당연히 존재할 것이라고 생각하고 사용하고 있는 API들을 묶어보면 다음과 같다.

- Browser Runtime API (Web API) → `window.*`
  - alert, confirm
  - local storage, session storage
  - setTimeout
  - …
- DOM (Document Object Model) → `document.*`
  - querySelector
  - addEventListener
  - …

그리고 프론트엔드 애플리케이션은 런타임 뿐만 아니라 네트워크를 통해 통신하는 서버에도 의존한다. 데이터를 제공받기 위해 API 호출을 통한 **서버와의 커뮤니케이션** 또한 의존성이라고 볼 수 있는 것이다.

## 의존성의 문제

Node.js 환경에서는 앞서 프론트엔드 애플리케이션이 정상적으로 동작하기 위한 의존성들이 존재하지 않는 경우가 많다. 이 의존성을 어떻게 구성하느냐에 따라 접근을 다르게 하여 이 문제를 해결할 수 있다. 복제, 주입 두 가지 방법을 살펴볼 예정이며 msw와 같이 새로운 기술을 통해 외부 의존성을 대체하는 방법도 있는데, 이 부분은 이 글과는 거리가 있다고 판단하여 간단히 언급만 하고 넘어간다.

### 의존성 복제

복제라고 표현했는데, 필요로 하는 환경을 똑같이 구성하거나 필요로 하는 기능을 똑같이 만들어주는 단순한 방법으로 문제를 해결할 수 있다.

대표적인 예로 [jsdom](https://github.com/jsdom/jsdom)이라는 모듈이 있다. jsdom은 Node.js와 함께 사용하기 위해 많은 웹 표준, 특히 WHATWG DOM 및 HTML 표준을 순수 자바스크립트로 구현한 것이다. 웹 브라우저의 API를 에뮬레이션하여 노드 환경에서도 브라우저 런타임이 존재하는 것처럼 제품을 실행시킬 수 있는 것이다.

기능을 동일하게 사용할 수 있도록 런타임을 구성해줌으로써 다른 런타임에서도 애플리케이션의 정상 동작을 보장할 수 있고 테스트 코드도 동작할 수 있게 된다.

### 의존성 주입

복제하는 방법도 있겠지만 의존성을 주입(Injection)하는 방법으로도 해결할 수 있다. 의존성 이야기가 나오면 자연스럽게 의존성 주입 이야기가 나오기 때문에 어색한 용어는 아니다. 앞서 살펴본 의존성 개념에 맞춰서 의존성 주입이 무엇인지 살펴보자.

#### 주입

특정 환경에 의존하고 있는 것이 문제가 되었다. 특정 환경을 입맛에 맞춰 지정해줄 수 있다면 어떨까? 환경이 필요한 이유를 미리 알 수 있다면 대응할 수 있다. 예를 들어 다음과 같은 기능을 구현하기 위해 브라우저 환경에서 존재하는 document 객체가 필요하다고 가정해보자.

```tsx
document.addEventListener('onload', () => {
  alert('hello');
})
```

document의 모든 API를 사용하진 않는다. `addEventListener`만 필요하다고 미리 알 수 있다면 다음과 같이 document라는 객체를 인자로 받게 끔 코드를 바꿔볼 수 있다.

```tsx
interface DocumentFeature {
  addEventListener: (eventName: Event, callback: any)
}

function addListener(document: DocumentFeature, eventName: Event, callback: any) {
  document.addEventListener(eventName, callback)
}

addListener(document, 'onload', () => {
  alert('hello');
})
```

기능은 다르지 않지만 구현부에서 document를 직접 참조하느냐, 함수의 인자로 받느냐가 다르다.

#### 계약

예제에서 `DocumentFeature`라는 인터페이스에 주목할 필요가 있다. 예제에서 코드를 수정할 때 

> `addEventListener`만 필요하다고 미리 알 수 있다면

이라는 가정이 있었다. 즉, 필요한 기능이 무엇인지 사전에 합의가 필요하다는 것이고 우리는 이것을 인터페이스로 정의했다. 반대로 필요한 기능을 정의한다고 볼 수 있고 이것을 일종의 계약(contract)이라고 볼 수 있다.

`addListener` 의 첫번째 인자 `document`에는 `DocumentFeature`라는 계약만 따른다면 그 어떤 것이라도 전달될 수 있는 것이다.

#### 다시 주입

앞선 예제를 통해 우리는 주입한다는 것을 기능의 **준비**과 **사용**의 관심을 서로 **분리**하는 것이라고 해석할 수 있다.

- 준비: 기능을 제공할 수 있도록 생성하거나 준비 (인스턴스화, 정의 등)
- 사용: 제공받는 기능을 사용하는 것

주입받는다는 것을 다음과 같이 정리해볼 수 있다.

## 코드로 살펴보기

프론트엔드 개발자에게 친숙한 React의 Context API를 활용해 의존성 주입 예제를 간단하게 구성해보았다. 구체적인 설명 대신 두 가지의 차이를 먼저 살펴보자.

### [Before] 직접적으로 의존하는 경우

```jsx
function ServicePage() {
  useEffect(() => {
    LogClient.log(...)
  }, [])

  return <div>...</div>
}
```

`ServicePage`라는 컴포넌트는 `LogClient`를 가져와서 컴포넌트 내에서 호출한다. (눈치가 빠른 사람들은 `import` 키워드가 직접적으로 의존한다는 것임을 알 수 있을 것이다.)

### [After] 의존성을 주입받는 경우

Context API와 hooks를 사용하여 Dependency Injection을 흉내내보자.

우선 로깅을 위해 `log`라는 기능이 필요하다는 계약을 먼저 정의할 수 있다.

```tsx
interface LogClientSpec {
  log: (...) => void;
}

export class LogClient implements LogClientSpec {}
```

1. `LogClientSpec`라는 계약을 만들고
2. 이 계약을 수행하는 `LogClient`를 정의한다.

*ServicePage.tsx*

```jsx
function ServicePage() {
  const client = useContext(LogContext);

  useEffect(() => {
    client.log(...)
  }, [])

  return <div>...</div>
}
```

1. `log`라는 기능이 필요했고 그 기능이 있어야 한다는 '계약'에 충실한 `client` 객체를 `LogContext`로부터 받는다.
2. `ServicePage`라는 컴포넌트는 `LogClient`의 존재에 대해 알지 못한다.

*App.tsx*

```tsx
function App() {
  const client = new LogClient();

  return (
    <LogContext.Provider client={client}>
      <ServicePage />
    </LogContext.Provider>
  );
}
```

1. 앞서 이야기한 '계약'을 수행하는 `LogClient`를 생성한다.
2. `ServicePage` 외부에서 `LogClient`를 생성하고 Context Provider를 통해 필요한 LogClient를 전달(주입)한다.

### 만약 테스트를 한다면?

`ServicePage`가 렌더링되고 로그가 잘 동작하는지 확인하려면 어떻게 테스트 코드를 작성할 수 있을까?

`LogClient.log`의 구현이 **외부에 의존하고 있을 경우** 테스트하기 어렵다. 애플리케이션의 '외부'라는 것인 API의 호출이 있거나 runtime을 참조하고 있는 경우를 말한다.

하지만 직접적으로 참조하지 않을 경우, 즉 `LogClient`를 상황에 따라 적절하게 '생성'하여 '주입'해줄 수 있다면 실제로 로그 기능이 외부에 의존했더라도 테스트 환경에서는 다르게 동작할 수 있도록 코드를 작성할 수 있다.

***ServicePage.test.tsx***

```jsx
test('ServicePage 가 렌더링되면 Screen 로깅을 한다.', () => {
  const fn = jest.fn();
  const logClient = new DebugLogClient({ log: fn });

  render(<ServicePage />, {
    wrapper: ({children}) => {
      return <LogContext.Provider client={logClient}>{children}</LogContext.Provider>
    }
  })
});
```

- 외부에 의존하지 않는 `DebugLogClient`를 만들었고 `ServicePage`가 테스트 코드 환경에서 렌더링될 때는 이 client를 참조하게 끔 코드를 작성했다.
- 이제 DebugLogClient의 `log` 메서드가 제대로 호출되는지 확인한다면 실제로 로그 기능이 정상 동작한다는 것을 확인할 수 있다.

```tsx
expect(fn).toHaveBeenCalled(); // success!
```

## 마무리

의존성이 무엇인지 간단히 알아봤다. 프론트엔드 테스트 코드를 작성하는데 있어서 어떤 방해공작을 펼치고 있는지 확인했으며 이를 어떻게 해결할지도 간단히 살펴봤다. 좋은 테스트 코드에 대한 이야기도 이어서 해볼 예정이다.
