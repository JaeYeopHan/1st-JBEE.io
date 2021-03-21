---
title: '효율적인 프런트엔드 에러 핸들링'
date: 2021-03-13 18:03:28
category: react
thumbnail: './images/error-handling-thumbnail-0.png'
draft: false
---

![thumbnail](./images/error-handling-thumbnail-0.png)

제품을 개발한다면 에러 처리(Error Handling)는 반드시 마주하는 일이고 피할 수 없는 관심사라고 생각합니다. 에러를 어떻게 분류할 수 있는지 그리고 어떻게 처리할 수 있는지 고민을 해봤습니다. 좀 더 나아가 에러를 처리하는데 있어서 사용자 경험을 고려하며 우아하게 처리할 수 있도록 시도한 경험을 공유합니다.

### 1. [React에서 선언적으로 비동기 다루기](/react/error-declarative-handling-1/)

에러를 효율적으로 다루기 위해 선언적으로 비동기를 정의하고 처리하는 방법을 고민했고 그 결과물을 공유합니다. Suspense와 ErrorBoundary를 사용하여 비동기 컴포넌트를 보다 효율적으로 처리하는 컴포넌트를 소개합니다.

- 명령형으로 처리하기
- 선언형으로 처리하기
  - Suspense
  - ErrorBoundary
- 비동기 컴포넌트 Wrapper

### 2. [클라이언트의 사용자 중심 예외 처리](/react/error-declarative-handling-2/)

에러를 환경에 따라 그리고 사용자 중심으로 분류하고 각각의 에러 특징을 분석합니다. 분류된 에러를 처리하기 위해 필요한 것들을 정리합니다.

- 에러는 어떤 종류들이 존재할까
- 에러를 어떻게 대응할 수 있을까
- 현실 속의 에러

### 3. [선언적으로 에러 상황 제어하기](/react/error-declarative-handling-3/)

1장에서 만들어 둔 AsyncBoundary를 사용하여 2장에서 알아본 에러를 직접 대응해봅니다.

- 비동기 컴포넌트를 다루기 위한 준비
- API call Error Handling

<br />

---

<br />

이 글이 React 애플리케이션에서 발생하는 여러 종류의 에러를 다루는 데 도움이 되면 좋겠습니다. 질문과 피드백은 환영합니다.
