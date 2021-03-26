---
title: '선언적으로 에러 상황 제어하기'
date: 2021-03-21 19:03:28
category: react
thumbnail: './images/error-handling-thumbnail-3.png'
draft: false
---

![thumbnail](./images/error-handling-thumbnail-3.png)

1편에서 살펴본 AsyncBoundary 컴포넌트로 2편에서 분류한 에러들을 어떻게 다룰 수 있는지 살펴봅니다. 이 포스팅은 1편과 2편을 먼저 읽어야 좀 더 이해가 쉽습니다.

### Table of Contents

- 비동기 컴포넌트를 다루기 위한 준비
- API Call Error Handling

# 비동기 컴포넌트를 다루기 위한 준비

앞서 3가지가 필요하다고 말했다.

1. 예상 가능한 에러와 예상할 수 없는 에러를 판단할 기준
2. 에러 모니터링을 위한 도구
3. 에러 전파를 막기 위한 장치 → AsyncBoundary

## 예상했던 에러인가?

API에서 내려오는 status code 말고 다른 값이 필요하다. 에러를 구체화하기 위한 errorCode도 좋고 의도한 에러인지 아닌지에 대한 flag 값도 좋다.

```tsx
export function isExpectedError<T>(res: unknown): res is ExpectedError {
  if (typeof res !== 'object' || res == null) {
    return false
  }

  return res.expected
  // or return res.errorCode != null
}
```

try-catch statement의 `catch` 에서 전달받는 error를 이 함수로 예상한 에러인지 아닌지를 판단하여 상황에 따른 처리를 해주자.

## 에러 모니터링하자

에러 모니터링을 위한 도구로 [Sentry](https://sentry.io/welcome)를 사용할 수 있다. 진행하고 있는 프로젝트에서 Sentry 붙이는 것은 어렵지 않다. 이 글에서 Sentry Setup 내용까지 다루기엔 너무 길어지므로 자세한 내용은 따로 정리해둔 [Sentry 활용하기](https://github.com/JaeYeopHan/tip-archive/issues/76)를 참고하면 된다.

## AsyncBoundary 확장하여 사용하기

비동기 컴포넌트를 앞 장에서 만들어준 [AsyncBoundary](https://jbee.io/react/error-declarative-handling-0/)로 감싸주는 경우, 에러가 **전역으로 퍼지는 것을 방지**할 수 있다. 에러가 발생했을 경우, ErrorBoundary에서 catch되기 때문이다. 컴포넌트에서 바로 사용할 수 있도록 일반적인 pendingFallback과 rejectedFallback을 전달한 AsyncBoundary를 만들어두고 사용하자.

### ExtendsAsyncBoundary

```tsx{9-14}
export default function ExtendsAsyncBoundary({
  pendingFallback = defaultPendingFallback,
  rejectedFallback = defaultRejectedFallback,
  ...props
}: Props) {
  return (
    <AsyncBoundary
      pendingFallback={pendingFallback}
      rejectedFallback={({ error, reset }) => {
        if (isExpectedError(error)) {
          return rejectedFallback({ error, reset })
        }
        Sentry.captureError(error)
      }}
      {...props}
    />
  )
}
```

`rejectedFallback`에서 Expected Error가 아닌 경우, 에러도 Sentry에서 캡쳐하여 모니터링 가능하도록 해두었다.

### onReset

ErrorBoundary에서 capture된 에러를 초기화시켜주기 위해 reset을 호출하는데 이 때 다른 곳에 캐싱된 무언가도 초기화를 시켜줘야 하는 경우가 생긴다. react-query로 호출한 API에서 발생한 에러는 react-query에 캐싱되기 때문에 reset되는 시점에 캐싱된 error도 reset해줘야 한다.

```tsx{2}
export default function AsyncBoundaryWithQuery({ ...props }: Props) {
  const { reset } = useQueryErrorResetBoundary()

  return <ExtendsAsyncBoundary onReset={reset} {...props} />
}
```

react-query에서 캐싱된 에러는 `useQueryErrorResetBoundary`를 사용하여 reset 할 수 있고 상황에 따라 에러를 초기화해줄 필요가 있다면 `onReset` 인터페이스를 통해 진행할 수 있다.

### ignoreError

`ExtendsAsyncBoundary`의 로직에 따르면 호출하는 API에서 발생한 에러가 Expected 에러일 경우, `rejectedFallback`을 렌더링하게 된다. 그러나 이 에러가 **전역에서 처리해야 하는** 에러인 경우엔 어떻게 할 수 있을까?

이럴 경우, 전역으로 그 처리를 위임해줘야 한다. 때문에 비동기 컴포넌트를 감싸고 있는 AsyncBoundary에서 capture하지 않을 error를 판별할 수 있도록 해야 한다. `ignoreError`라는 interface를 새로 만들어서 filter할 수 있도록 해주자.

```tsx
export default function AsyncBoundaryWithQuery({ ...props }: Props) {
  const { reset } = useQueryErrorResetBoundary()

  return (
    <ExtendsAsyncBoundary
      onReset={reset}
      ignoreError={(error) => isGlobalError(error)}
      {...props}
    />
  )
}
```

대표적인 예로 인증과 관련된 에러는 로그인 화면으로 redirect 시켜줘야 한다. 그리고 인증이 필요한 대부분의 API에서 발생할 수 있기 때문에 한 곳에서 처리를 해주면 된다. 로그인 페이지로 이동하기 전 노출해야 하는 컴포넌트가 따로 존재한다면 전역에 그 처리를 위임할 수 있다.

## 서비스 코드에서 사용해보기

AsyncBoundary를 사용성 좋게 wrapping한 AsyncBoundaryWithQuery로 쉽게 비동기 컴포넌트를 다룰 수 있게 되었다.

```tsx
function User() {
  const { data: user } = useQuery(
    '/api/user',
    () => get<User>('/api/user'),
    { suspense: true },
  );

  return (
    <div>{user.name}</div>
  )
}

export function Main() {
  return (
    <AsyncBoundaryWithQuery>
      <User>
    </AsyncBoundaryWithQuery>
  )
}

```

### 명령형으로 에러 초기화하기

모든 상황에서 선언적으로 에러를 초기화해주는 것이 이상적일 수는 없다. 어떤 경우에는 명령형으로 에러를 초기화해줄 수 있어야 하는데 현재의 AsyncBoundary에는 그런 인터페이스가 없다. 이럴 경우, [useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle)을 사용하여 reset 시킬 수 있는 인터페이스를 만들어 줄 수 있다.

```tsx{7-9}
interface ResetRef {
  reset?(): void
}

const AsyncBoundary = forwardRef(function _AsyncBoundary(
  { pendingFallback, children, ...props }: Props,
  resetRef: Ref<ResetRef>
) {
  const ref = useRef<ErrorBoundary | null>(null)

  useImperativeHandle(resetRef, () => ({
    reset: () => ref.current?.resetErrorBoundary(),
  }))

  return (
    <ErrorBoundary ref={ref} {...props}>
      <SSRSuspense fallback={pendingFallback}>{children}</SSRSuspense>
    </ErrorBoundary>
  )
})
```

`ErrorBoundary`에서 정의해줬던 `resetErrorBoundary` 함수를 외부에 노출(expose)하여 ref를 통해 명령형으로 에러를 초기화해줄 수 있다.

# API call Error Handling

비동기 컴포넌트의 경우 AsyncBoundary를 통해서 에러를 다뤘다. 그렇다면 다음과 같은 경우엔 어떻게 할 수 있을까?

```tsx{6}
export function User() {
  const handleFieldSubmit = async (payload: UserLoginPayload) => {
    try {
      await login('/api/auth', payload)
    } catch (error) {
      // TODO: error handling
    }
  }

  return (
    <form onSubmit={handleSubmit(/* handleFieldSubmit */)}>
      {/* input email, */}
      <button type="submit">로그인</button>
    </form>
  )
}
```

위 코드처럼 catch statement 안에서 자체적으로 처리하는 방법 말고도 두 가지 방법이 더 있을 것 같다.

- 가장 가까운 ErrorBoundary로 위임하는 방법
- 전역 이벤트 핸들러로 위임하는 방법

## ErrorBoundary로 처리를 위임

강제로 컴포넌트 레벨에서 에러를 throw하여 가장 가까운 ErrorBoundary에서 에러를 catch하도록 구현할 수 있다. 다음과 같은 간단한 hooks로 구현이 가능하다.

```tsx
export default function useErrorBoundary<ErrorType extends Error>() {
  const [error, setError] = useState<ErrorType | null>(null)

  if (error != null) {
    throw error
  }

  return setError
}
```

이 hooks를 통해 반환되는 setError를 catch statement에서 실행하면 컴포넌트 레벨에서 발생한 에러이므로 가장 가까운 ErrorBoundary가 catch하게 된다.

## 전역 unhandledrejection 처리

우선 Expected Error에 대해서는 처리하던 방식대로 처리할 수 있다. 그리고 Unexpected Error인 경우에는 모니터링을 위해 Sentry 로깅을 해준다.

```tsx
try {
  await login('/api/auth', payload)
} catch (error) {
  if (isExpected(error)) {
    switch (error.errorCode) {
      case '잘못된 이메일 형식':
        return /**/
      case '이미 가입된 이메일 주소':
        return /**/
      default:
        return /**/
    }
  }
  // TODO: warning toast
  Sentry.capture(error)
}
```

`Sentry.capture(error)` 이 부분을 API 호출 때마다 해줘야 하는 것은 참 불편하다. 그리고 toast message를 보여주는 등의 예상치 못한 에러가 발생했음을 사용자에게 알려줘야 맞지 않을까?

expected error만 내부에서 처리하고 예상치 못한 에러는 **전역에서 공통으로 처리해줄 수 없을까?** (이 부분에 대해 아이디어를 제안해주신 토스페이먼츠 동료 [현섭님](https://seob.dev/), [의현님](https://github.com/noahluftyang)께 이 글을 빌어 감사의 인사를 드립니다!)

### [Window: unhandledrejection event](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event)

Unexpected Error는 따로 핸들링 해주지 않는다면 (unhandled) 되지 않을까? 그리고 unhandled event에서 공통으로 처리해줄 수 있지 않을까?

다음과 같은 hooks를 만들면 핸들링되지 않는 reject 이벤트에 대해 처리해줄 수 있다.

```tsx
import { useEffect } from 'react'

type Handler = (event: PromiseRejectionEvent) => void

export default function useUnhandledRejectionError(handler: Handler) {
  useEffect(() => {
    window.addEventListener('unhandledrejection', handler)

    return () => {
      window.removeEventListener('unhandledrejection', handler)
    }
  }, [handler])
}
```

Unexpected Error의 경우 throw하여 전역에 그 처리를 위임할 수 있다. 위 예제처럼 Expected Error가 있는 경우라면 다음과 같이 Unexpected Error를 throw하여 전역에 그 처리를 위임할 수 있다.

```tsx
try {
  await login('/api/auth', payload)
} catch (error) {
  if (isExpectedError(error)) {
    /* 에러 성격에 따른 처리 */
  } else {
    throw error
  }
}
```

이제 전역의 unhandledrejection 이벤트에서 에러를 핸들링해주자.

```tsx
useUnhandledRejectionError(({ reason: error }) => {
  openWarningToast(
    Validator.isEmptyStringOrNil(error.message)
      ? '에러가 발생하였습니다.'
      : error.message
  )
  captureError(error)
})
```

## 마무리

총 세 편에 나누어 에러 핸들링을 어떻게 효율적으로 할지 다뤄봤습니다. 이 글이 React 애플리케이션에서 발생하는 여러 종류의 에러를 다루는 데 도움이 되면 좋겠습니다. 질문과 피드백은 환영합니다.

|       |                                                                           |
| :---: | :-----------------------------------------------------------------------: |
| Intro | [0. 효율적인 프런트엔드 에러 핸들링](/react/error-declarative-handling-0) |
