---
title: '전역 상태 관리에 대한 단상 (stale-while-revalidate)'
date: 2020-12-20 19:12:65
category: react
thumbnail: './images/thinking-about-global-state.png'
draft: false
---

![thinking-about-global-state](./images/thinking-about-global-state.png)

이 글의 부제는 **Stop Using Redux for Caching for API Response**이다. 한 때 전역 상태 관리 도구로 [Redux](https://github.com/reduxjs/redux)를 즐겨썼던 개발자로서 이제 더이상 Redux를 사용하지 않게 된 이유와 회고를 담은 글이다.

### Table of Contents

- 전역 상태 (Global State)
- Manage State
- 다시 전역 상태

# 전역 상태 (Global State)

이 글의 대상 중 하나인 Redux라는 도구에 대해 이야기하기 전에, 만들고 있는 애플리케이션에서 '전역'으로 존재할 수 있는 상태가 무엇인지 고민해볼 필요가 있다.

> 전역 상태란 무엇인가?

먼저 전역 상태라는 단어는 '전역'이라는 단어와 '상태'라는 단어의 합성어이다.

## 상태(state)

먼저 상태에 대해 생각해보자.

웹 페이지에 보여지고 있는 화면은 Document, 즉 하나의 문서이다. 그리고 이 정적인 문서에 어떤 내용을 동적으로 변경해주기 위해선 여러 가지 작업들이 필요했다.

- 사용자가 원하는 동작을 실행시킬 DOM Element를 찾는다. (Call To Action Element)
- 동적으로 변경되는 타이밍에 대해 콜백(핸들러)을 정의한다. (Click Event Handler)
- 변경하고자 하는 내용이 위치하고 있는 DOM Element를 찾는다. (Target Element)
- 핸들러에서 변경하고자 하는 내용으로 수정한다. (Edit)

각각의 과정에서 비용이 많이 드는 경우 최적화를 진행하곤 했다. 이 때 이 문서가 React와 같은 라이브러리로 작성되면서 동적으로 변할 수 있는 것들에 대해서 분리를 하고 그것들에 따라 문서가 바뀔 수 있도록 되었다. 그러면서 웹 프런트엔드의 개발이 **컴포넌트 기반**으로 이루어지면서 하나의 문서가 여러 작은 컴포넌트로 나뉘게 되었다.

컴포넌트에선 '동적으로 변할 수 있는 것'을 **상태**로 관리하고 이 상태가 변함에 따라 새로운 값을 화면에 보이도록 프런트엔드가 만들어졌다.

React에서는 상태(state)를 다음과 같이 정의하고 있다.

"Plain JavaScritp Object hold information influences the output of render"

당연하게도 리액트 컴포넌트를 만들 때, 변하지 않는 것은 상태로 정의하지 않는다. 컴포넌트 외부에 상수로 정의하여 참조하는 것으로 충분하기 때문이다. 즉, **상태(state)**는 애플리케이션의 **렌더링**에 영향을 미치는 것들을 의미한다.

## 전역(Global)

보여지고 있는 문서의 어떤 곳에서라도 접근할 수 있는 영역을 '전역'이라고 할 수 있다. HTML 문서에 script 태그로 변수를 선언하면 저 script 태그가 load 된 이후에 업로드 된 JavaScript 코드에 `foo` 라는 변수에 접근할 수 있다.

```tsx
<!DOCTYPE>
<html>
<body>
  <h1>What is Global State<h2>
  <script>
    var foo = 'me';
  </script>
</body>
</html>
```

상태에 대해 생각할 때, 컴포넌트와 비교해서 생각한 것처럼 '전역'이라는 개념을 컴포넌트에서의 상태와 비교하자면 컴포넌트에서의 상태는 **지역적(local)**이고 컴포넌트 안에서만 접근할 수 있으므로 **고립되어(isolate)**있다.

무언가가 전역에 존재한다는 것은 컴포넌트 뿐만 아니라 컴포넌트 외부 그리고 애플리케이션의 코드 어디에서든지 접근 가능함을 의미한다.

## 전역 상태를 정의해보기

그렇다면 전역 상태는 다음과 같이 정리할 수 있지 않을까?

> 애플리케이션을 구성하고 있는 코드 어디에서든지 접근이 가능하며, 변화에 따라 렌더링에 영향을 줘야하는 값

그렇다면 이 전역 상태를 어떻게 활용할 수 있을지 살펴보자.

# Manage State

보통 애플리케이션에서 관리하는 상태는 다음 두 가지로 나눌 수 있다.

- 외부에서 주입되는 동적인 데이터 (ex. Server Response)
- 애플리케이션 UI 상태 (ex. isOpen)

렌더링하기 위한 동적인 데이터나 사용자 액션을 제어하기 위한 UI 상태 두 종류이다. 전자에 비해 후자는 컴포넌트 내에서만 사용되는 경우가 많기 때문에 관리하기가 상대적으로 쉽다.

## Server cache

대부분의 프런트엔드 애플리케이션은 서버 API로부터 데이터를 받아 렌더링하는 부분이 존재하고 다음과 같이 작성할 수 있다.

1. 데이터를 불러온다. (비동기)
2. 데이터를 호출한 컴포넌트의 state로 정의한다.
3. 이 state를 필요한 컴포넌트의 props로 전달한다.

이러한 과정을 거치게 되는데, 이 때 컴포넌트의 깊이(depth)가 깊어질 경우 props를 여러번 전달해줘야 하기 때문이다. 보통 [컴포넌트 합성(Component Composition)](https://kentcdodds.com/blog/prop-drilling)을 통해 어느 정도 해결이 가능하다.

하지만 아직 1번, 2번도 데이터를 가져오고 관리하는 면에서 봤을 때 불확실한 부분이 많다.

- 1번) 언제 불러오는가?
- 2번) 어디서? 어느 컴포넌트에서 state로 정의하는가

### 데이터를 호출해야 하는데, 언제 어디서 호출할 것인가

불필요한 네트워크 비용을 줄이기 위해서 **필요한 시점**에 데이터를 불러오는 것이 맞다. 그리고 데이터를 필요로 하는 컴포넌트에서 데이터를 호출하는 것이 응집도가 높아지는 방향이다. 여기서 발생하는 문제점은 API의 응답 구조와 컴포넌트 트리가 일치하리라는 보장이 없다는 것이다.

간단한 예를 들어보자. 거래내역을 조회하는 애플리케이션의 일부분을 예제 코드로 살펴보자.

```tsx
interface Transaction {
  id: string;
  amount: number;
  fee: number;
  date: string;
  buyer: Buyer;
  status: string;
}

function fetchTransactions(): Promise<Transaction[]> { ... }
```

거래내역 목록을 보여주는 컴포넌트를 만들어야 할 때, 거래내역 목록 API를 호출해야 한다. 그리고 이 API는 `TransactionList` 라는 컴포넌트에서 호출하는 것이 가장 이상적이다. (cc. [좋은 코드란 무엇인가](https://jbee.io/etc/what-is-good-code/#where))

```tsx
function TransactionList() {
  const [transactions, setTransaction] = useState()

  useEffect(() => {
    const transactions = fetchTransactions() // Async 생략
    setTransaction(transactions)
  }, [])

  return (
    <ul>
      {transactions.map((transaction) => {
        return <li> ... </li>
      })}
    </ul>
  )
}
```

그런데 이 거래내역 목록 API의 데이터를 필요로 하는 컴포넌트가 하나 더 있다면 어떻게 해야할까?

특정 컴포넌트 내부에서 API의 응답값을 state로 관리할 경우, 여러 컴포넌트에서 그 값을 공유해야 할 때 귀찮아 진다. A 컴포넌트와 B 컴포넌트에서 `foo` 라는 상태를 공유하기 위해선 A컴포넌트와 B컴포넌트의 부모 컴포넌트에서 `foo` 라는 상태를 가지고 있고 각각에게 props로 전달해줘야 한다. (cc. [Lift State Up](https://reactjs.org/docs/lifting-state-up.html))

```tsx
function DailyTransaction() {
  return (
    <main>
      <Suspense>
        <TransactionList />
      </Suspense>
      <MainAccount /> {/* <- 이 컴포넌트에서 나의 주계좌를 보여줘야 하는 경우 */}
    </main>
  )
}
```

`DailyTransaction` 컴포넌트 에서도 다시 한번 거래내역 목록 API를 호출하게 되면 네트워크 비용이 한번 더 발생하기 때문에 낭비가 된다. 그렇기 때문에 `DailyTransaction` 컴포넌트에서 거래내역 목록 API를 호출하고 `TransactionList` 컴포넌트와 `MainAccount` 컴포넌트에 데이터를 내려주게 된다.

```tsx
function DailyTransaction() {
  const transactions = fetchTransactions()
  return (
    <main>
      <TransactionListA transactions={transactions} />
      <TransactionListB transactions={transactions} />
    </main>
  )
}
```

이런 상황은 계속해서 발생할 수 있다. 이렇게 상태를 lifting 해줄 필요가 없도록 서버로부터 받는 데이터를 전역에서 관리한다면 어떻게 될까?

```tsx
function DailyTransaction() {
  const dipatch = useDipatch()

  useEffect(() => {
    dispatch('fetchTransactions')
  }, [])

  return (
    <main>
      <TransactionListA />
      <TransactionListB />
    </main>
  )
}

function TransactionListA() {
  const transactions = useSelector((state) => state.transaction)

  return <ul>{/* render transaction */}</ul>
}
```

[react-redux](https://github.com/reduxjs/react-redux) 라는 라이브러리를 사용하여 쉽고 빠르게 redux에 접근할 수 있게 되었다. 더이상 props를 전달해주거나 다른 곳에서도 값이 쓰일 경우 state를 lifting 해줄 필요가 없다. 필요로 하는 값은 redux에 접근하여 `useSelector` 로 원하는 값을 가져오면 된다. 컴포넌트의 구조 변경에도 자유로워진 것 같고 코드가 훨씬 깔끔해졌다.

## 응답값을 redux에서 관리할 때 발생하는 문제들

1. 필요로 하는 값은 redux에 존재한다는 가정
2. 서버에서 값이 변한다면

### 필요로 하는 값은 redux에 존재한다는 가정하에?

위 예제 코드에서 `TransactionListA` 컴포넌트를 다시 살펴보자.

```tsx
function TransactionListA() {
  const transactions = useSelector((state) => state.transaction)

  return <ul>{/* render transaction */}</ul>
}
```

이 컴포넌트는 데이터와 그에 따른 UI가 응집도 있게 잘 구성되어 있어서 동일한 UI의 거래 내역을 보여줘야 하는 경우, 얼마든지 재사용할 수 있어보인다. 하지만 이 컴포넌트는 redux에 접근하여 **가져올 값이 있다는 가정** 하에 유효한 컴포넌트이다. 이 컴포넌트가 마운트(mount)되기 전에 다음 코드는 **반드시** 실행되어야 한다.

```tsx
useEffect(() => {
  dispatch('fetchTransactions') // fetch server api !!!
}, [])
```

Redux에서 서버로부터 값을 가져오는 액션이 dispatch 되지 않는다면 `transactions`는 초기 상태값 (initial state)이 전달될 것이다. 특정 action이 dispatch 되어야 state에 접근할 수 있도록 하는 무언가가 필요해보인다. 하지만 redux 어디에서도 강제하지 않는다. 즉, 컴파일 단계에서 아무런 에러를 뱉지 않으며 런타임이 되서야 발견된다.

그렇다면 Redux에 값이 무조건 있음을 보장하기 위해서 무조건 최상단에서 서버 데이터를 fetch하는 액션을 dispatch해야 하는가? 바로 이전 섹션(링크)에서 다음과 같이 이야기 했다.

> 불필요한 네트워크 비용을 줄이기 위해서 **필요한 시점**에 데이터를 불러오는 것이 맞다.

방금 말한 해결책은 이 내용과 완전히 반대되는 내용이다.

Redux에서 서버 데이터를 관리함으로써 데이터에 접근하는 시점에 데이터가 있음을 보장할 수 없게 되었고 애플리케이션의 크기가 커지면 커질수록 데이터의 흐름을 따라가기 힘들게 된다.

### 서버에서 값이 변한다면?

서버로부터 값을 가져와 redux에 저장(또는 캐시라는 표현을 사용할 수 있겠다.)하기 위해선 특정 시점에 액션이 dispatch되어야 한다. 결국 액션이 dispatch 되는 시점에 캡쳐(capture)된 데이터가 저장되는 것이다. 이 시점 이후에 변경된 서버의 값은 액션을 다시 dispatch 하기 전까지 반영되지 않는다.

이 시점은 어떻게 알 수 있을까? 이 시점을 알기 위한 무언가가 또 필요하다.

이 문제는 이미 redux 팀에서도 인정하고 있다. 이 글에서는 언급하지 않고 넘어갈 redux의 verbose한 boilerplate 코드도 [redux-toolkit](https://jbee.io/react/introduce-redux-starter-kit) 으로 대응이 된 것처럼 이 문제도 해결하기 위한 무언가가 등장했다. (cc. [rtk-query](https://github.com/rtk-incubator/rtk-query))

이미 동일한 데이터를 두 군데에서 관리한다는 것에서 Single source of Truth 원칙을 위배한다. 위 예제 코드에서는 거래내역이라는 데이터를 서버에서도 저장하고 있고 클라이언트의 메모리에도 저장하는 것이다. 호출한 시점에서는 동일한 내용의 데이터겠지만 다시 서버 API를 호출하기 전에 어떤 변화가 있을지 알 수 없기 때문에 두 데이터가 동일하다는 것을 보장할 수 없게 된다.

## Cause

Redux를 서버 데이터 캐싱에 사용했던 이유가 무엇이었나 되돌아보면 '네트워크 비용이 한번더 발생'하기 때문이었다. 이 문제를 해결하기 위해 여러 부작용이 발생한 것을 보면 올바른 접근이라 생각되지 않는다.

데이터가 필요할 때마다 서버 API를 호출하고 그 비용을 없애면 되지 않을까?

## Caching in memory

Redux에서 캐싱해두는 것처럼 단순히 메모리에 캐시를 해두면 되지 않을까? React 16.8에서 소개된 hooks API를 통해 간단한 메모리 캐시를 만들 수 있다.

이전 예제 코드에서 사용했던 거래내역 API를 불러오는 함수에 이 방법을 적용해보자. 단순한 코드로 표현하면 다음과 같다.

```tsx
function fetchTransactions(): Promise<Transaction[]> { ... }

const CACHE = {}; // <-- Use cache!

function useTransaction() {
  const [data, setData] = useState(defaultValue);

  useEffect(() => {
    const cacheID = 'key'; // <-- Cache key!

    if (CACHE[cacheID] != null) {
      setData(CACHE[cacheID]);
    }

    fetchTransaction().then(response => {
      CACHE[cacheID] = response.data;
      setData(response.data);
    });
  }, [url]);

  return data;
}
```

`CACHE` 라는 단순한 object에 key, value로 서버의 응답을 캐싱해두는 것이다. 이미 캐싱되어 있는 응답이 있다면 그 값을 반환하고 없다면 서버로부터 데이터를 fetch 해온 값을 반환한다.

후자의 경우를 위해 이 Transaction 값에 대한 별도의 `status`가 추가되면 좋을 것 같다. 또한 cache가 expire되는 시점을 정해 Garbage collect가 원활히 이루어지도록 해제(delete)해주는 과정도 필요할 것 같다. Cache를 단순한 Object가 아닌 다음과 같은 interface로 잡는다면 꽤 쓸만할 것 같다.

```tsx
export interface CacheInterface {
  get(key: keyInterface): any
  set(key: keyInterface, value: any): any
  keys(): string[]
  has(key: keyInterface): boolean
  delete(key: keyInterface): void
  clear(): void
  serializeKey(key: keyInterface): [string, any, string, string]
  subscribe(listener: cacheListener): () => void
}
```

몇 가지만 보충해주면 Redux를 사용했을 때의 문제점이었던 데이터를 불러오는 시점과 데이터에 접근하는 시점의 불일치, 데이터가 있음을 보장하지 못하는 부분은 이런 식으로 해결할 수 있을 것 같다.

그러나 서버의 데이터가 클라이언트에 중복으로 저장되어 캐싱된 데이터가 out-of-date 되는 문제는 아직 해결하지 못했다.

## stale-while-revalidte

[HTTP Spec RFC 5861](https://tools.ietf.org/html/rfc5861)에서 stale Content에 대한 [Cache-Control](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Cache-Control) 확장이 있다.

```yaml
Cache-Control: max-age=<seconds>, stale-while-revalidate=<seconds>
# ex) Cache-Control: max-age=1, stale-while-revalidate=59
```

위 예제 HTTP Header가 기술하는 내용은 다음과 같다.

- HTTP 요청이 1초 내에 반복적으로 발생할 경우, 캐시된 값을 별도의 검증없이 그대로 반환한다.
- HTTP 요청이 1 ~ 60 초 사이에 반복적으로 발생할 경우, 캐시된 값은 이미 낡았지만(out-of-date) 캐싱된 값을 반환한다. 이와 동시에 백그라운드에서 향후 사용을 위해 캐시를 새로운 값으로 채우도록 재검증 요청이 이루어진다.
- 60초 이후에 들어온 HTTP 요청에 대해선 다시 서버에 요청을 보낸다.

이 state-whilte-revalidate 로직을 메모리 캐시에도 적용할 수 있지 않을까? 이미 많은 구현체가 있다.

- [react-query](https://github.com/tannerlinsley/react-query)
- [swr](https://github.com/vercel/swr)
- [rtk-query](https://github.com/rtk-incubator/rtk-query)

(세 라이브러리를 비교한 문서는 [여기](https://react-query.tanstack.com/comparison)를 참고하면 된다.)

react-query를 사용하여 아까 예제 코드 중 `TransactionList` 를 rewrite 해보면 다음과 같다.

```tsx
function fetchTransactions(): Promise<Transaction[]> { ... }

function TransactionListA() {
  const { data: transactions, isLoading } = useQuery('transaction', fetchTransactions);

  return isLoading ? <Loading> : <ul>{/* render transaction */}</ul>;
}
```

# 다시 전역 상태

이 글에서는 전역 상태를 다음과 같이 정의했다.

> 애플리케이션을 구성하고 있는 코드 어디에서든지 접근이 가능하며 변화에 따라 렌더링에 영향을 줘야하는 상태값이며 그 값은 상수가 아닌 변수.

그렇다면 그 값이 변경되었을 때, 모든 컴포넌트의 렌더링에 영향을 줘야하는 값에는 어떤 것이 있을까?

### 테마

웹 페이지가 테마를 가지고 있어서 테마에 따라서 다른 색상으로 보여져야 한다면 이 '테마'라는 값은 모든 컴포넌트에 영향을 줘야 하고 컴포넌트들은 테마가 달라질 경우 다시 렌더링 되어야 할 것이다.

### 다국어 처리

다국어 처리가 되어 있는 애플리케이션에서 위치 기반으로 맞는 언어를 보여주거나 사용자가 임의로 언어를 설정할 수 있다. 이 때 텍스트가 존재하는 모든 컴포넌트는 다시 렌더링 되어야 할 것이다. 거의 전역으로 볼 수 있지 않을까?

애플리케이션의 특성에 따라서 전역 상태를 정의하기 나름이지만 이 이외에 일반적인 애플리케이션의 경우에는 전역 상태에 저장할 상태는 없다고 생각한다. 애플리케이션의 크기가 커지면 커질수록 전역에서 관리해야 하는 상태는 없어진다.

## Context API

Context API와 Redux를 비교하는 글들이 많다. 이 둘은 비교 대상이 애초에 아니지만 하는 역할이 비슷하다보니 비교하는 글들이 많은 것 같다. 대부분 Context API로 전역 상태를 관리할 수 있지 않냐는 물음을 던지고 re-render되는 퍼포먼스 때문에 전역 상태를 관리하기에 적합하지 않다는 결론을 내리고 있다.

이 글에서 정의한 전역 상태로 본다면, 전역 상태로 관리해야 하는 값이 아닌 값을 전역 상태로 관리하다보니 애플리케이션 전반의 성능에 영향을 미치고 있다는 것을 알 수 있다. 전역으로 관리하고 있는 상태는 애플리케이션 전반에 리렌더링을 발생시켜야 한다. 그렇기 때문에 위에서 언급한 두 경우에 대해선 Context API로 충분하다는 결론을 내릴 수 있다.

# Summary

서버의 응답을 캐싱하기 위한 목적으로 Redux는 어울리지 않는다. 위에서 언급한 두 가지 상태, 외부 데이터 그리고 UI 상태만 잘 분리해서 관리해도 애플리케이션의 완성도가 높아진다. 그 중 전자에 해당하는 외부에서 주입되는 동적인 데이터는 캐싱에 기반하여 서버 API를 바라보도록 하고 UI 상태들은 필요한 컴포넌트에 정의되어 있어야 한다. 그래야 응집도가 높고 재사용성이 높아진다.

## Inspired by

- [https://kentcdodds.com/blog/application-state-management-with-react](https://kentcdodds.com/blog/application-state-management-with-react)
- [https://web.dev/stale-while-revalidate/](https://web.dev/stale-while-revalidate/)
- [https://www.toptal.com/react-hooks/stale-while-revalidate](https://www.toptal.com/react-hooks/stale-while-revalidate)
