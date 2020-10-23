---
title: '좋은 코드란 무엇일까?'
date: 2020-10-23 21:10:65
category: etc
thumbnail: './images/good_code_thumbnail.png'
draft: false
---

![](./images/good_code_thumbnail.png)

'성선설'에 기반하면 모든 개발자들은 좋은 코드를 작성하고 싶을 것이라고 생각한다.

## Table of Contents

- 좋은 코드가 도대체 뭐지?
- 왜 좋지 않은 코드가 생산되는가?
- 좋지 않은 코드를 줄이기

# 좋은 코드가 도대체 뭐지?

'좋은 코드란?'이라고 구글링해보면 많은 검색 결과가 나온다. 나도 그렇고 다들 궁금했던듯하다. '좋은 코드'란 녀석은 정체도, 실체도 없이 이 세상에 떠돌고 있다. 모두가 '좋은 코드'의 기준이 조금씩 다르고 각각의 경험을 기반으로 좋은 코드를 정의하고 있다. 세간에 좋은 코드의 정의는 정말 많다.

- 읽기 쉬운 코드
- 중복이 없는 코드
- 등등...

## 읽기 쉬운 코드가 좋은 코드?

이 제목의 책도 있다. 제목 그대로의 내용을 담고 있고 읽기 쉬운 코드를 작성하기 위해서 지켜야 할 몇 가지를 제안하고 있다.

### 읽기 쉬우려면 주석을 쓰면 되지 않나?

단순하게 생각해서 읽기 쉽도록 코드를 작성하려면 작성자에게 **익숙한 언어를 사용**하면 된다. 한국인이라면 영어로 복잡하게 작성된 코드보다 한국어가 익숙하지 않을까? 모든 코드에 한국어로 주석을 상세히 작성해두면 코드를 읽지 않아도 코드가 무엇을 하는지 빠르고 쉽게 파악할 수 있다.

```js
❌
// 이름: 원리금상환반환값
// 설명: 원리금상환을 시도했을 때, 요청자의 신용도에 따라 보여줄 텍스트를 3초 뒤에 반환해주는 함수
// 인자1: m: 요청자에 대한 정보 (신용도 함수로 전달되는 데이터 객체)
// 인자2: pe: 3초가 되기 전에 우선 보여줘야 하는 텍스트
// 반환: a: 보여줘야 하는 값
function a(m, pe) {
  let a
  const t = s(pe)
  const b = dc(m)

  setTimeout(() => {
    if (b) {
      a = dd()
    } else {
      a = t(b)
    }
  }, 3000)

  if (a) {
    return pe
  } else {
    return a
  }
}
```

코드는 이해하기 힘들지만 주석만 읽어봐도 언제 사용해야하며 무엇을 함수의 인자로 전달하고 무엇이 반환되는지 알 수는 있다.

하지만 주석은 관리되기 쉽지 않다. 주석은 기본적으로 **메타데이터**이며 주석의 설명과 함수의 역할이 일치하리란 **보장이 없다.** 수시로 변하는 요구사항을 반영하느라 함수를 수정할 때 주석이 함께 수정되지 않을 수도 있다. 오히려 한 두 가지의 잘못된 주석으로 코드를 이해하는데 혼란을 야기할 수 있다.

### 나한텐 읽기 쉬운데?

코드가 읽기 쉽도록 작성되어야 함은 너무나도 분명하다. 하지만 모든 개발자가 동일한 배경지식을 갖고 있는 것은 아니다. 각자 다른 환경에서 코드를 작성하고 읽기 때문에 '읽기 쉽다'는 것은 개개인에게 다르게 다가간다.

변수명을 잘 짓는다는 것도, 영어를 제 1 언어로 사용하고 있지 않은 사람들에겐 다르게 다가간다. 어떤 누군가에겐 어색한 영어로 짓는 변수명이 잘 읽힐 수도 있기 때문에 잘 지은 변수명 또한 각자의 배경 지식에 따라 기준이 모호하다.

또한 코드를 작성하는 입장에서는 그 코드를 작성할 당시 작성한 코드에 대한 이해가 100%일 수밖에 없다. 이런 인식속에서 '읽기 쉽게' 작성하고자 노력해도 한계가 있을 수 밖에 없다.

(그 땐 잘 읽혔는데...🤔)

### 읽기 쉬우면 끝인가?

읽기만 쉬우면 될까? 너무 원초적이고 당연한 이야기이기에 와 닿지가 않는다. 읽기 쉽다는 것은 단순히 코드를 읽는 것만 의미하는 것이 아니라 **이해하는 것**까지 포함하기 때문에 나무 뿐만 아니라 숲을 볼 때도 쉬워야 한다.

그보다 더 근본적인 이유, 좋은 코드가 읽기 쉬운 코드라면 **왜 읽기 쉽도록 작성해야 하는가?** **어떻게 읽기 쉽도록 작성하는가?** 에 대한 물음으로 좋은 코드에 대한 정의를 다시 한번 생각해 볼 수 있다.

> 왜 읽기 쉬워야 하지?

## 중복이 없는 코드?

개발자라면 누구나 A와 B에서 동일한 로직을 수행하는 코드를 보는 순간, 추출(extraction)하고 싶어한다. 동일한 로직을 수행하는 코드가 여기에도 저기에도 있는 것은 굉장히 불편하기 때문이다.

> 이 불편함은 어디에서 오는 걸까?

오래전에 작성해둔 코드에서 A라는 동일한 코드 조각이 두 군데에 퍼져있다는 것을 기억하기 쉽지 않다. 때문에 한 곳의 A만 수정되었을 때 다른 한 곳에서 버그가 발생한다. 이러한 경험에 기반하여 동일한 로직을 수행하는 코드는 별도의 함수로 빼두고 재사용하려고 한다.

### 그 땐 같았지만 지금은 같지 않은

하지만 이렇게 같이 사용하고 있는 코드는 수정하기가 쉽지 않다. 분명 A라는 코드 조각은 여기 저기에서 동일한 로직을 수행하여 별도로 추출했지만 시간이 지나고 어딘가에서 A와 의 조금 다른 A' 역할을 수행해야 된 것이다.

```ts
function task({ isFromA, isFromB, isFromC }) {
  const a = foo()
  const b = bar()
  const option = isFromA ? 'a' : isFromB ? 'b' : isFromC ? 'c' : ''

  return zar(a, b, option)
}
```

그 때는 중복이었던 코드 조각을 필요에 의해 추출했지만 지금은 아니라서 다시 합치거나 수정하고 있다. 보통 하는 일은 동일하지만 그 목적이 다른 코드를 추출했을 때, 많이 발생하는데 이것은 변경 사항을 반영하는데 비용이 들어가게 한다.

> 추출은 어떤 '기준'으로 해야할까?

# 왜 좋지 않은 코드가 생산되는가?

사실 우리는 코드를 작성할 당시에는 모두 좋은 코드를 작성하기 위해 노력한다. 그러나 이것을 **놓치는 시점이 존재**하고 좋지 않은 코드가 생산되는 것은 아닐까.

> 어쩌다가 코드가 상하게 되는걸까?

## 우리는 어떤 상황들을 마주하게 되는가?

개발자는 새로운 프로젝트를 만들기도 하지만 기존의 코드를 수정하기도 하고 다시 만들기도 한다. 그리고 새롭게 만든 프로젝트는 세상의 빛을 보기도 전에 수정될 가능성이 (매우) 많다.

- 이미 운영 중인 서비스의 CS 대응하며 수정하기
- QA가 진행중인 프로젝트 버그 수정하기
- 변경된 요구사항, 인터페이스를 반영하기
- 어제 또는 방금 작성한 코드 수정하기
- ...

### 쓰이지 않는 코드

더이상 쓰지 않게 된 코드가 있는데, 이 코드가 어디에서 쓰일지도 모른다는 불안감이 있다면 감히 삭제하지 못할 것이고 이 코드는 **깨진 유리창** 중 하나가 된다.

> 이 불안감은 어디에서 오는 것일까?

#### 1. 거리

이것은 코드를 사용하고 있는 부분과 코드가 작성된 부분의 거리가 멀어서 발생하는 문제이다. 삭제하고자 하는 코드가 일정 범위에서만 사용된다는 확신이 있다면 그 범위만 확인 후 사용하지 않는 코드라는 확신을 얻을 수 있다.

#### 2. 순수하지 않은 함수

외부의 값을 기반으로 동작하는 함수는 그 side effect를 통제하기 어렵다. 함수의 입출력만 확인하여 함수 내부를 수정할 수 없다면 그 함수는 수정이 어렵게 된다.

```js
function getWage(name) {
  return this.getMySalary(name) / this.getTotalTime(new Date())
}
```

`getWage`란 함수는 `name`이라는 입력 외에도 `getMySalary`라는 입력으로 정의되지 않은 입력이 존재하며 `new Date()`를 통해 항상 값이 변하는 값에 의존하고 있다.

### 응급 처치를 한 코드

중복으로 빼뒀지만 가져다 쓰는 곳에서 다른 로직을 추가해줘야 할 때가 있다. 작업이 필요한데 발생할 사이드 이펙트가 두려워 함수에 입력을 추가하던가 option을 추가하여 내부에서만 처리를 할 때 그 코드는 누더기가 되고 만다.

이렇게 응급 처치가 한 두번 이뤄지면 누구도 알아보기 어려운 함수가 탄생한다. 당연히 이런 함수는 우리가 찾고 있는 좋은 코드라고 할 수 없다.

# 좋지 않은 코드를 줄이기

좋지 않다고 생각되는 코드들을 살펴봤다. 좋은 코드란 좋지 않은 코드가 없는 코드를 말한다. 좋은 코드를 작성하려고 노력하는 대신 **좋지 않은 코드를 줄여보자**. 그리고 **격리**해보자.

작성된 모든 코드는 결국 유지 보수 비용이 필요하다. 궁극적으로 우리의 코드는 **점진적으로 개선**이 가능해야 한다.

## 추출이 아닌, 의존성을 드러내기 위한 추상화

추출과 추상화는 무엇이 다를까?

#### 추출(extraction)

'추출하다(extract)'의 어원을 살펴보면 ex(밖으로)와 tract(끌어내기)의 합성어이다. 특별한 기준없이 단순히 밖으로 끌어내는 것을 의미하는 것이다.

#### 추상화(abstraction)

'추상화하다(abstract)의 어원은 조금 다르다. abs(먼 개념)와 tract(이끌어내기)의 합성어로, 어떤 대상의 중요한 요점들을 재해석하여 정리한 것이라고 해석할 수 있다.

### How

우리가 별도 함수 또는 파일로 추출하는 이유는 여러 가지가 있을 수 있다. 다른 곳에서 재사용하기 위해 분리할 수도 있고 단지 하나의 파일이 커졌기 때문에 분리할 수도 있다.

단순히 중복된 코드 덩어리에 대해 추출를 진행하게 되면 재사용하기 어렵다. 오히려 함수 간의 의존 관계를 파악하기 위한 비용이 들어가게 된다. 잘못 추출한 것이다.

함수를 분리하여 정의할 때는 그 함수의 역할을 인지하고 하나의 역할만 할 수 있도록 정의해야 한다. 즉 의존성을 드러내기 위함이 그 목적이 되어야 한다.

즉, 한 파일에 여러 로직들이 서로 얽혀있을 때 각각의 코드 조각들 중 서로 의존성이 있는 것들을 기반으로 추상화를 진행해야 한다. 이렇게 추상화가 된 함수는 하나의 목적(역할)을 갖게 되고 의미있는 추출(추상화)이 이루어진다.

```tsx
const Spagetti = () => {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(10);
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const handlePage = () => {};
  const fetchData = async () => {
    fetch(page)
  };

  useEffect(() => {
    (aysnc (() => {
      setLoading(true)
      try {
        const data = await fetchData();
        setData(data)
      } catch (e) {
      //
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <Component> ... </Componnet>
  )
}
```

pagination을 관리하는 두 state(page, totalPage)와 data와 data의 상태를 관리하는 두 개의 hooks가 섞여있다. 이 코드가 다른 곳에서 동일하게 사용된다고 가정해보자.

그대로 추출한다면 다음과 같이 custom hooks를 하나 만들 수 있다.

```tsx
function useSpagettiData(initialPage: number, fetchFunction: () => Promise<Data>) {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(10);
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    fetch(page)
  };

  const handlePage = () => {};

  useEffect(() => {
    (aysnc (() => {
      try {
        const data = await fetchData();
        setData(data)
      } catch (e) {
        //
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return {
    page, data, isLoading, isError, handlePage, ...
  }
}

const Spagetti = () => {
  const { data } = useSpagettiData(1, fetchData)

  return ( ... );
}
```

일단 기존 Spagetti 컴포넌트는 매우 간결해졌다. (뿌듯?)

그런데 이 custom hooks가 여러 가지의 일을 하고 있다보니 이름부터 정하기 어렵다. 그리고 인자로 받는 값과 반환하는 값 또한 많아졌다. 이 때, data의 초기값을 설정해줘야 한다면? API 응답값에 따라 total page가 달라지는 경우가 있을 수 있다면?

아마 다음과 같이 hooks의 세번째 인자로 무언가가 추가되거나 내부에서 어떤 분기를 태워 로직을 구성해야할 것이다.

의존 관계가 있는 것들끼리만 추상화를 해보자.

```tsx
// pagination을 관리하는 hooks
function usePagination(initialPage: number) {
  const [page, setPage] = useState(initialPage);
  const [totalPage, setTotalPage] = useState(10);

  const handlePage = () => {};

  return { page, totalPage, handlePage };
}

// data fetch를 관리하는 hooks
function useFetch<T>(fetchFunction: () => Promise<T>, intialValue = null) {
  const [data, setData] = useState(intialValue);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    (aysnc (() => {
      try {
        const data = await fetchData();
        setData(data)
      } catch (e) {
        //
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return { data, isLoading, isError };
}

const Spagetti = () => {
  const { page, totalPage, handlePage } = usePagination(1);
  const { data } = useFetch(() => fetch(page);

  return ( ... );
}
```

위의 상황처럼 다른 요구사항이 들어왔을 때, 커다란 함수 내부에서 응급처치를 해주지 않아도 된다. 의존성을 기반으로 분리된 여러 함수들은 각자의 역할을 수행하고 있기 때문에 함수 내부를 건드릴 필요도 없다.

분리된 여러 함수들의 조합으로 프로그램을 구성하게 되면 어떠한 변경 사항에 대해 필요한 부분의 함수만 다른 함수로 수정을 해주면 되는 것이다.

### Where

무엇을 분리할지 알았다면 이제 어디로 분리할지 결정해야 한다. 그 이유는 함수가 정의된 곳과 실제로 사용하고 있는 코드가 멀어질 수록 의존 관계 파악이 어려워지기 때문이다.

컴포넌트를 렌더링하는 함수 컴포넌트일 경우, 어느 정도의 공유 레벨로 사용될지에 따라 정의되는 위치가 달라질 수 있다. 어떤 함수는 도메인과 강하게 결합되어 있어서 특정 페이지에서만 재사용될 수 있고 어떤 함수는 원시 타입과의 의존 관계만 있어서 어디에서든 사용될 수 있는 함수일 수 있다.

## 삭제하기 쉬운 코드와 삭제하기 어려운 코드의 분리

아무리 깔끔한 코드를 작성하려고 해도 비즈니스 요구 사항에 맞추다보면 어쩔 수 없이 복잡한 코드가 작성되기 마련이다. 사용하고 있는 라이브러리에서 발생한 버그일 수도 있고 여러 브라우저를 대응하다 생긴 코드일 수 있다.

이런 코드는 제 3자 입장에서 읽기도 어렵고 섣불리 삭제하기도 어려워진다. 복잡한 요구 사항을 담고 있는 코드는 변경에 유연하지 못하기 때문에 별도로 분리해둬야 한다.

좋지 않은 코드가 생산되는 것을 완전히 차단할 수 없다면 제대로 관리될 수 있도록 격리하는 것이다.

위에서 코드의 맥락을 이해하는데 방해가 될 수 있는 요소 중 하나로 주석을 이야기했지만 이 경우엔 주석과 함께 격리 시켜두면 기존 코드의 흐름을 끊지 않을 수 있다.

```tsx
const handler = (url: string) => {
  if (router.asPath !== url && !confirm(blockMessage)) {
    router.events.emit('routeChangeError')
    router.replace(router, `${router.asPath}${window.location.hash}`)

    // NOTE:
    // 현재 Next.js 네이티브 Block API가 없어서 임시로 라우트 실행 중 빈 string을 throw하는 형식으로 해결
    // 에러를 던지면 Runtime Error 오류가 뜨므로, string을 던집니다.
    // @see https://github.com/vercel/next.js/issues/2476#issuecomment-563190607
    throw ''
  }
}
```

## 일관성 있는 코드

최소한의 가독성을 보장하는 방법은 일관성 있는 코드를 작성하는 것이다. 일관성은 합의된 규칙으로부터 만들어지며 이 합의된 규칙은 개개인에게 동일하게 다가간다.

코드에 일관성이 지켜진다면 예측이 가능하다. 예측이 가능하다는 것은 어느 곳에 어떤 코드가 위치하는지 예상할 수 있다는 것이다.

### 1. Naming

변수명 네이밍도 중요하지만 작성되는 수많은 함수들의 네이밍에도 규칙이 있으면 코드안에서 일관성을 지킬 수 있다. react hooks API도 hooks임을 네이밍에서부터 드러내기 위해 `use-*` prefix를 사용한다.

단순히 이벤트 핸들러를 정의할 때도 convention을 지켜서 정의한다면 해당하는 convention의 함수를 보면 이벤트 핸들러라는 예상이 가능해진다.

```jsx
// Case 1.
// prefix: handle
// target: button
// action: click
const handleButtonClick = () => {}

// Case 2.
// prefix: on
// action: click
// target: button
const onClickButton = () => {}
```

위와 같이 `prefix`, `action`, `target` 이 일관된 규칙으로 작성되면 함수를 파악하는데 큰 도움이 된다.

### 2. Directory 구조

우선 디렉토리 구조와 아키텍쳐는 비교 대상이 아니다. (가끔 아키텍쳐를 디렉토리 구조라고 생각하는 사람들을 만나서 하는 말) 일관된 디렉토리 구조는 전체적인 구조를 파악하는데도 큰 도움이 되고 컴포넌트 간의 관계를 파악하는데에도 큰 도움을 준다.

Top Level의 directory 구성에 따라 어느 곳에 어떤 모듈 또는 컴포넌트들이 위치할지 예측이 된다면 코드를 빠르게 이해할 수 있다.

```jsx
src
├── api
├── components
├── hooks
├── model
├── pages
│   ├── contract
│   └── docs
└── utils
```

components 디렉토리라면 디렉토리 구조가 컴포넌트 heirachy를 드러낼 수 있고 pages 디렉토리라면 route path를 드러낼 수 있다. 코드가 어느 곳에 위치하는지 예상할 수 있도록 디렉토리 구조를 구성하면 코드를 파악하는데 큰 도움이 된다.

다음과 같은 구조는 어떨까?

```tsx
src
├── @shared
│   ├── components
│   ├── hooks
│   ├── models
│   └── utils
├── contract
│   ├── components
│   ├── hooks
│   ├── models
│   ├── utils
│   └── index.ts
├── docs
│   ├── components
│   ├── hooks
│   ├── models
│   ├── utils
│   └── index.ts
└── App.tsx
```

첫번째 디렉토리 구조는 관심사에 따라 디렉토리를 분리했고 두번째 디렉토리 구조는 페이지(도메인 영역)에 따라 디렉토리를 분리했다. 애플리케이션이 커지고 복잡해지다보면 첫번째 디렉토리 구조의 경우, 코드가 정의된 곳과 코드 사용되는 곳이 멀어지는 문제점이 발생한다. Featured Based 디렉토리 구조(2번째 디렉토리)를 가져간다면 이 문제를 해결할 수 있다. 애플리케이션 전반에서 공통으로 사용되는 것들만 Top Level의 `@shared` 디렉토리에서 관리하고 나머지는 응집도 높게 각각의 디렉토리에서 관리하는 것이다.

이런 디렉토리 구조에 대한 고민이 있던 와중에 [안희종님의 글 - 지역성의 원칙을 고려한 패키지 구조: 기능별로 나누기](https://ahnheejong.name/articles/package-structure-with-the-principal-of-locality-in-mind/)을 읽었는데, 잘 정리해주셨다.

## 확장성 있는 코드

확장이 어려운 코드는 내부적으로 많은 변경이 발생하며 이것은 코드를 읽기 어렵게 만든다.

스타일링만 되어있는 가장 단순한 Input 컴포넌트를 만든다고 가정해보자.

```tsx
const Input = styled.input`
  // styling
`;
const Input = ({
  type,
  value,
  onChange,
}) => {
  return (
    <Input type={type} value={value} onChange={onChange}>
  )
}
```

이 컴포넌트는 확장에 닫혀있다. (다행히 `type`은 props로 받았다.) 확장에 닫혀있다는 뜻은 이 Input 컴포넌트에 새로운 이벤트 핸들러나 값을 전달하기 어려운 구조라는 뜻이다. `ref`를 전달할 수도 있고 focus, blur 이벤트에 핸들러를 추가할 수도 있다. 이러한 변경이 발생할 때마다 props를 추가해줘야 하기 때문이다.

props를 추가하는게 당연하다고 생각한다면 확장성 있는 코드에 대해 관심이 없었다는 뜻이다.

이 Input 컴포넌트 목적에 따라 달라지겠지만 정말 (굳이) 스타일링만 추가된 Input 컴포넌트를 별도로 만든다면 다음과 같이 만들어야 한다.

```tsx
const Input = styled.input`
  // styling
`;

const Input = (props: HTMLAttributes<HTMLInputElement>) => {
  return (
    <Input {...props}>
  )
}
```

기존 `input` HTML Element가 받을 수 있는 attribute들을 그대로 받을 수 있어야 하는 것이다. 이 컴포넌트가 의미있는 컴포넌트가 되려면 validator에 대한 처리가 추가되면 좀 더 의미있어진다.

```tsx
interface Props extends HTMLAttributes<HTMLInputElement> {
  isValid?: boolean;
}
const Input = ({ isValid, ...props }: Props) => {
  return (
    <Input {...props} isValid={isValid}>
  )
}
```

확장성의 가장 간단한 예시로 살펴봤다.

## 결론

> So What?

- 의존성을 고민하자.
- 일관성있게 작성하자.
- 확장 가능하도록 설계하자.
- 어쩔 수 없는 코드는 주석과 함께 격리하자.
