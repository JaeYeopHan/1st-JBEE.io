---
title: 'React에서 선언적으로 비동기 다루기'
date: 2021-03-14 18:03:28
category: react
thumbnail: './images/error-handling-thumbnail-1.png'
draft: false
---

![thumbnail](./images/error-handling-thumbnail-1.png)

에러를 효율적으로 다루기 위해 선언적으로 에러를 정의하고 처리하는 방법을 고민했고 그 결과물을 공유합니다. [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html)와 [ErrorBoundary](https://reactjs.org/docs/error-boundaries.html#gatsby-focus-wrapper)를 사용하여 비동기 컴포넌트를 보다 효율적으로 처리하는 컴포넌트를 소개합니다.

### Table of Contents

- 명령형으로 처리하기
- 선언형으로 처리하기
  - Suspense
  - ErrorBoundary
- 비동기 컴포넌트 Wrapper
  - AsyncBoundary

# 명령형으로 처리하기

우리에게 익숙한 명령형으로 비동기 처리와 에러 처리하는 부분에 대해 먼저 살펴보려고 한다.

## try-catch statement

먼저 일반적인 비동기 처리를 살펴보자.

```tsx
async function getUser() {
  const response = await apiClient.get<User>(`URL`)

  return response
}
```

이런 간단한 호출의 경우에도 비동기 상태에 따른 별도 처리가 필요하다. 그리고 try-catch statement로 감싸서 에러에 대한 처리가 필요하다.

```tsx{3,8}
async function getUser() {
  try {
    // start loading
    const response = await apiClient.get<User>(`URL`)

    return response
  } catch (error) {
    // handle error
  }
}
```

이 함수를 함수 컴포넌트에서 사용하기 위해선 `useState`, `useEffect` 등의 hooks를 이용해 리액트 컴포넌트의 상태로 데이터를 관리해야 한다.

### 문제점

- 컴포넌트에서 그대로 가져다 쓰기에는 불편한 '비동기' 함수다.

## Hooks

위와 같은 API를 컴포넌트에서 사용하기 위해 공통 부분을 보통 hooks로 추상화 하곤 한다. 흔하디 흔한 예제 코드를 살펴보면 보통 다음과 같은 Hooks를 소개하곤 한다.

```tsx
function useUser() {
  const [data, setData] = useState<User | null>(null)
  // loading state
  // error state

  useEffect(() => {
    let isCancelled = false
    ;(async () => {
      const user = await getUserInfo()

      if (isCancelled) {
        return
      }

      setData(user)
    })()

    return () => {
      isCancelled = true
    }
  }, [])

  return { data /* loading, error */ }
}
```

위 hooks에서 try-catch를 통해 로딩 상태와 에러 상태를 정의한 뒤, `getUserInfo` 부분만 extract 한다면 쓸만한 hooks가 될 것 같다.

보통의 비동기 처리에 대한 값을 반환할 때는 `loading`, `error` 등의 비동기 처리에 따른 상태(state) 값들도 함께 전달하게 되는데, 이 값들에 따른 처리가 필요하기 때문이다.

### 문제점

- 로딩 상태인지, 에러 상태인지 매번 확인하고 정의해줘야 한다. 발생하는 수많은 에러들을 각각의 컴포넌트 또는 hooks에서 처리를 해줘야 하기 때문에 손이 많이 간다.

> 비즈니스 로직을 구현하기도 시간이 부족한데 에러 처리까지 신경을 써야 할까?<br />
> 수많은 비동기 요청에 전부 비슷한 에러 핸들링 처리 코드가 필요할까?

# 선언적으로 처리하기

이 귀찮은 비동기 에러 핸들링을 선언적으로 처리할 수 있도록 **Suspense**와 **ErrorBoundary**를 이용하여 비동기 컴포넌트를 만들어보자.

## Suspense

Suspense는 비동기를 명령형으로 처리하고 있던 부분 중 `loading`을 담당하게 된다.

[swr](https://github.com/vercel/swr), [react-query](https://github.com/tannerlinsley/react-query) 등을 사용하면 다음과 같이 간단하게 처리할 수 있다. 이번 포스팅의 예제는 컴포넌트를 Suspended 상태로 만들어주는 suspense 옵션과 함께 작성할 예정이다.

```tsx{7}
function useUser() {
  return useQuery(
    `getUser`,
    () => {
      return apiClient.get<User>(`URL`)
    },
    { suspense: true }
  )
}
```

이제 컴포넌트에서 가져다 쓰는 코드는 다음과 같이 작성할 수 있다.

```tsx{4}
function Main() {
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <UserDropDown />
      </Suspense>
    </main>
  )
}

function UserDropDown() {
  const { data: user } = useUser()

  return <div>{user.name}</div>
}
```

현재 비동기 호출의 상태가 로딩(pending) 상태인지 판단할 필요없이 Suspense의 fallback props로 컴포넌트를 전달하여 로딩 상태에 따른 렌더링을 처리할 수 있다. 데이터 로드가 완료되는 시점(fulfilled)에 `UserDropDown` 컴포넌트가 렌더링 되는 것이다. 즉 `<UserDropDown />` 컴포넌트는 데이터 로드가 완료된 시점만 고려하면 되는 것이다. 좀 더 나아가 fallback 으로 전달되는 컴포넌트를 기준으로 한 단계 더 추상화하여 로딩 상태를 처리할 수도 있다.

사실 이 내용은 React 공식 문서에서 자세하게 다루고 있던 부분을 짧게 요약한 것이다. ([Concurrent Mode Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html))

### Server Side Rendering

Suspense는 서버 사이드 렌더링 환경에서 지원하지 않는다. 이를 대응하기 위해 서버 사이드 환경에선 전달받은 fallback 컴포넌트를 렌더링 할 수 있도록 기존의 Suspense 컴포넌트를 확장하여 사용해야 한다.

```tsx{16,19}
function useMounted() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}

export default function SSRSafeSuspense(
  props: ComponentProps<typeof Suspense>
) {
  const isMounted = useMounted()

  if (isMounted) {
    return <Suspense {...props} />
  }
  return <>{props.fallback}</>
}
```

컴포넌트가 mount 되는 시점을 Client 환경이라는 조건으로 가정하고 해당 시점을 알기 위한 hooks를 추가해준다. 기존 Suspense 컴포넌트의 props를 그대로 확장하며 서버 사이드 환경에서만 fallback 컴포넌트를 렌더링 해주면 된다.

### 해결한 부분

- `loading`이라는 상태 값을 따로 관리하지 않게 되었다.
- `loading`일 때 특정 컴포넌트를 보여줘야 하는 분기 처리를 공통 컴포넌트로 추상화 할 수 있게 되었다.

### 아직 해결하지 못한 부분

- loading 상태에 대한 부분은 Suspense를 통해 처리했지만 아직 error 상황에 대한 처리는 하지 못했다.

### Render as you fetch

React 공식 문서에서도 다루고 있는 내용이라 깊게 더 들여다보지 않고 이 정도로만 정리하고 넘어간다. 좀 더 자세한 내용이 궁금한 분은 React 공식 문서 [Traditional Approaches vs Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html#traditional-approaches-vs-suspense)를 살펴보면 된다.

## ErrorBoundary

error 상황에 대한 처리를 ErrorBoundary에게 위임해보자. React 공식 문서에서 소개하고 있는 ErrorBoundary 코드이다.

```tsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    logErrorToMyService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}
```

가장 기본적인 부분만 문서에서 다루고 있는데 이것을 조금 더 유연하게 확장할 수 있다. 필요한 요소들을 하나씩 살펴보면서 ErrorBoundary를 재정의해보자.

### renderFallback Props

위 예제 코드에서 `hasError` 일 경우, 렌더링하는 컴포넌트를 props로 받아 좀 더 유연한 ErrorBoundary를 정의할 수 있다. 다음과 같이 error 객체를 받는 컴포넌트를 props로 전달해주면 상황에 맞게 fallback UI를 지정할 수 있다.

```tsx{2}
<ErrorBoundary renderFallback={({ error }) => <ErrorAlert error={error} />}>
  {children}
</ErrorBoundary>
```

renderFallback props의 type은 간단하다.

```tsx
type RenderFallbackProps<ErrorType extends Error = Error> = {
  error: ErrorType
}

type RenderFallbackType = <ErrorType extends Error>(
  props: RenderFallbackProps<ErrorType>
) => ReactNode
```

이렇게 전달받은 fallback을 `hasError`일 때 렌더링만 해주면 된다.

### reset

ErrorBoundary 내부 상태에 `hasError` 값이 **상태로 존재하기 때문에** 이를 다시 초기화해줄 인터페이스가 필요하다. 부모 컴포넌트를 다시 mount 시키지 않는 이상, ErrorBoundary에서 capture 된 에러는 다시 초기값으로 돌이가지 않기 때문이다.

인터페이스를 고민하기 앞서 어떤 시점에 초기화가 필요할지 정리해보면 다음과 같다.

- 에러 상황에서 렌더링 되는 fallback 컴포넌트에서 reset 할 수 있으면 어떨까?
- reset도 선언적으로 할 수 없을까? 예를 들면 특정 값이 변경될 때 reset을 시켜준다던가?

위 요구사항을 기준으로 인터페이스를 고민해보면 다음과 같다.

1. Error Fallback에서 reset 할 수 있는 인터페이스
2. reset을 선언적으로 호출할 수 있는 인터페이스

#### Error Fallback에서 reset 할 수 있는 인터페이스

위에서 정의한 renderFallback props의 타이핑을 다음과 같이 수정해야 에러 상황에서 렌더링하는 컴포넌트에 reset handler를 전달해줄 수 있다.

```tsx{3}
type RenderFallbackProps<ErrorType extends Error = Error> = {
  error: ErrorType
  reset: (...args: unknown[]) => void
}
```

#### reset을 선언적으로 호출할 수 있는 인터페이스

특정 상황에서 에러가 발생했다면, 다른 상황일 때는 에러를 초기화 해주고 다시 에러가 발생하는지 catch해야 할 것이다. 즉 상황에 대한 정의를 ErrorBoundary에 전달함으로써 선언적으로 에러를 초기화해줄 수 있다.

`useEffect` hooks처럼 dependency array 같은 것을 만들 수 있지 않을까? 배열을 전달하여 값이 변경되는 경우, 상황이 바뀌었으니 에러를 초기화 하면 된다. 이 방법은 react-query, swr 등에서도 사용하는 방법으로 react-query에서는 [queryKey](https://react-query.tanstack.com/guides/query-keys)를 기반으로 데이터 캐싱 여부를 판단한다. 우리가 확장하는 ErrorBoundary에서는 `resetKeys`라는 것으로 에러 초기화 여부를 판단한다.

```tsx{9}
interface Props {
  // ...
  resetKeys: unknown[]
}

componentDidUpdate(prevProps: Props) {
  if (this.state.error == null) {
    return;
  }
  if (isDifferentArray(prevProps.resetKeys, this.props.resetKeys)) {
    // Trigger Reset
  }
}
```

`componentDidUpdate`에서 resetKeys 배열의 변경을 감자하여 에러를 초기화해준다.

### reset 구현

인터페이스를 만들어뒀으니 이제 ErrorBoundary 안에서 reset을 구현하면 된다.

```tsx{14}
// error fallback에 전달할 reset handler
resetErrorBoundary = () => {
  // ErrorBoundary state를 초기화
  this.setState(initialState);
};

render() {
  const { children, renderFallback } = this.props;
  const { error } = this.state;

  if (error != null) {
    return renderFallback({
      error,
      reset: this.resetErrorBoundary,
    });
  }
  return children;
}
```

### 확장된 ErrorBoundary

에러를 선언적으로 정의할 인터페이스를 설계하고 이를 구현까지 해봤다. 소개한 기능들은 [react-error-boundary](https://github.com/bvaughn/react-error-boundary)에 구현되어 있다. 정말 유용한 라이브러리이지만 개인적으로 아쉬운 부분이 있어 이 컴포넌트를 한번 더 확장하여 사용하고 있다. (3장에서 추가로 다룰 예정)

# 비동기 컴포넌트 Wrapper

이제 Server Side Rendering Safe한 Suspense와 에러를 reset 할 수 있는 ErrorBoundary를 조합하여 비동기 컴포넌트를 처리하기 위한 Wrapper 컴포넌트를 만들 수 있다.

## AsyncBoundary

이름은 비동기 환경을 가둔다고 해서 AsyncBoundary라고 지었다. 단순히 Suspense와 ErrorBoundary를 조합한 Wrapper 컴포넌트이다.

```tsx
type ErrorBoundaryProps = ComponentProps<typeof ErrorBoundary>;

interface Props extends Omit<ErrorBoundaryProps, 'renderFallback'> {
  pendingFallback: ComponentProps<typeof SSRSafeSuspense>['fallback'];
  rejectedFallback: ErrorBoundaryProps['renderFallback'];
}

function AsyncBoundary({
  pendingFallback,
  rejectedFallback,
  children,
  ...errorBoundaryProps,
}: Props) {
  return (
    <ErrorBoundary
      renderFallback={rejectedFallback}
      {...errorBoundaryProps}
    >
      <SSRSafeSuspense fallback={pendingFallback}>
        {children} {/* <- fulfilled */}
      </SSRSafeSuspense>
    </ErrorBoundary>
  );
});

export default AsyncBoundary;
```

Promise의 상태를 기준으로 fallback props 네이밍을 했다. 로딩 상태에 대한 fallback을 **pendingFallback**, 에러 상태에 대한 fallback을 **rejectedFallback**으로 지정하였다.

### Usage

비동기로 데이터를 가져오는 컴포넌트를 다룰 때, AsyncBoundary를 사용할 수 있다. `User`라는 컴포넌트에서 비동기 호출을 하고 있다면 부모 컴포넌트에서 AsyncBoundary로 감싸주면 된다.

```tsx
function UserList() {
  return (
    <AsyncBoundary pendingFallback={<Loading />} rejectedFallback={<Error />}>
      <UserDropDown />
    </AsyncBoundary>
  )
}

// Suspended Component
function UserDropDown() {
  const { data: user } = useUser() // async call

  return <div>{user!.name}</div>
}
```

데이터가 로드되기 전(pending)엔 pendingFallback으로 전달한 `<Loading />` 컴포넌트가 렌더링 될 것이고, 비동기 작업 도중 에러가 발생할 경우 `<Error />` 컴포넌트가 렌더링 될 것이다. 우리가 의도한 `<UserDropdown />` 컴포넌트는 데이터가 로드된 이후 렌더링 된다.

## 마무리

비동기 컴포넌트를 다루는 일은 굉장히 많이 있지만 손이 많이 가는 작업이며 이를 선언적으로 처리하는 것은 쉽지 않다. Suspense와 ErrorBoundary를 적절히 조합하여 비동기 컴포넌트를 다루기 위한 만들어봤는데 사용자 경험 입장에서도 개발 생산성에서도 좋은 효과를 보이고 있다.

이 글에선 react-query를 사용하여 쉽게 Suspense를 사용했는데, `fetch` API로도 사용할 수 있다. [이 글](https://charles-stover.medium.com/react-suspense-with-the-fetch-api-a1b7369b0469)을 참고해보면 Suspense 내부 원리를 이해하고 어떻게 활용할 수 있는지 알 수 있다.

다음 장에서는 우리가 평소에 어떤 에러들을 처리를 하고 있는지 에러 자체에 대해 알아본다.

|       |                                                                               |
| :---: | :---------------------------------------------------------------------------: |
| Next  | [2. 클라이언트의 사용자 중심 예외 처리](/react/error-declarative-handling-2/) |
| Intro |   [0. 효율적인 프런트엔드 에러 핸들링](/react/error-declarative-handling-0)   |
