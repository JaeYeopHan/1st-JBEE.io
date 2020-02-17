---
title: '[React] 4. React Router 다루기'
date: 2019-11-04 16:11:48
category: react
---

![react-ecosystem](./images/react-ecosystem.png)

이번 프로젝트에서 routing 관리를 위해 react-router를 사용했다.

## Directory 구조

CRA로 프로젝트를 처음 스캐폴팅하게 되면 기초적인 부분만 scaffolding해주고 나머지는 개발자의 몫이다. router 이야기를 하기 전에 디렉토리를 어떠한 기준으로 어떠한 계층으로 나누면 의미있을지에 대한 내용을 이야기해보려고 한다.

### Routing directory 제거

보통 `routes` 또는 `pages` 라는 디렉토리에 routing을 관리한다. Next.js 프레임워크에서는 `pages` 디렉토리 안에 파일을 정의하면 이 기준으로 route를 생성하기도 한다. 보통의 react 프로젝트에서 routing을 관리하는 directory를 만들고 이 안에 컴포넌트를 정의하게 되면 `Switch`, `Route` 등의 코드들이 작성되고 directory 기반의 트리를 만들어둔다. 이런 식으로 구성하다보니 directory 구조와 routing은 꽤나 밀접한 구조를 갖게 되었다.

그런데 이렇게 하는 일이 딱히 없는 코드들이 top level의 directory position을 가져가는 것이 마음에 들지 않았다. 보낼 곳은 `components` directory 한 곳 뿐이었고 directory 구조만으로 route를 구성할 수 있지 않을까 하는 생각이 들었다. 어떻게 잘 풀어볼까 고민 끝에 `index.ts` 파일을 잘 활용해보기로 하였다.

### /components

```
components
├── common
├── routeA
│   ├── routeA-foo
│   │   ├── RouteAFoo.tsx
│   │   └── index.tsx
│   ├── RouteA.tsx
│   └── index.tsx
├── routeB
│   ├── RouteB.ts
│   └── index.tsx
├── routeC
│   ├── RouteC.ts
│   └── index.tsx
└── App.tsx
```

`index.tsx` 파일에 `Switch`, `Route` 등 routing 관련된 코드들이 들어간다. 중첩된 라우터가 존재한다면 이와 동일하게 진행한다. 공통적으로 사용되는 컴포넌트를 모아둔 `common` directory를 제외하고 `components` 디렉토리 하위로 자연스럽게 트리가 형성된다.

#### localhost:3000/routeA

`index.tsx` 파일에 routing을 정의하다보니 정작 `routeA` routing에 해당하는 view 컴포넌트가 갈 곳이 없어졌고 이를 대체하기 위해 routing을 따라 PascalCase 파일을 작성하기로 정했다.

### Store, Components, etc...

일반적인 redux application에는 store와 관련된 directory가 있을 것이다. redux 사상에 맞춰 actions directory, reducer directory로 작성할 수 있다. 이번 프로젝트에서는 [Redux architecture](https://jbee.io/react/react-2-redux-architecture/)에서 이야기한 것 처럼 ducks pattern을 적용하였으며 이에 맞게 module 단위로 directory를 구성했다.

## 그 외 directory

### /domains

그리고 module 단위에 맞춰 사용되는 entity type, 상수들을 domain directory에 module 단위로 정의해두었다.

### /configs

컴파일 타임에서 필요한 것들을 정의해두는 directory로 Phase 별로 달라질 수 있는 상수들을 정리해두었다. Phase마다 달라질 수 있는 것으로는 API의 base url, phase 상수, static resource path 등이 존재한다. 이러한 값들을 phase에 따라 다른 값으로 컴파일한다. [1편 개발 환경 세팅](https://jbee.io/react/react-1-development-environment-setup/#-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%84%B8%ED%8C%85)에서 가볍게 언급하고 넘어간 phase 관련 내용이다. 이 부분은 [Webpack의 DefinePlugin](https://webpack.js.org/plugins/define-plugin/)을 이용했다.

### `/api`,`/utils`,`/hooks` directory

세 가지 비슷한 역할을 수행하지만 성격이 다르기 때문에 별도의 directory로 구분했다.

#### /hooks

우선 hooks API는 React Component에서만 사용되는 function이다. util과 비슷한 느낌이기 때문에 utils directory 로 관리할 수 있었지만 성격이 다르기 때문에 별도로 관리했다. 컴포넌트간 중복되는 로직을 custom hooks로 관리하고 있으며 이 디렉토리에는 `use-*` prefix가 추가된 함수들이 위치한다.

#### /api

api 요청하는 함수들이 위치한다. 이 함수들은 일반 util과 다르게 phase에 따른 분기가 들어가고 API versioning 정보들이 위치하게 된다. axios 라이브러리를 사용하는데, 공통 header를 Interceptor하여 axios instance를 공통으로 사용할 수 있도록 하였다.

#### /utils

utils 디렉토리는 범용적인 util 함수들이 위치하게 된다. `actionUtils.ts`, `currencyUtils.ts`, `formatUtils.ts` 등이 위치한다.

### 결과물

```
src
├── __tests__
├── api
│   └── index.ts
├── components
│   ├── common
│   ├── routeA
│   │   ├── routeA-foo
│   │   │   ├── RouteAFoo.tsx
│   │   │   └── index.tsx
│   │   ├── RouteA.tsx
│   │   └── index.tsx
│   ├── routeB
│   │   ├── RouteB.ts
│   │   └── index.tsx
│   └── App.tsx
├── configs
├── domains
├── hooks
├── modules
│   └── index.ts
├── utils
├── index.tsx
└── stories // storybook
---
```

## History 주입

react-router를 사용한다는 것은 브라우저의 history에 접근하여 라우팅을 관리하는 것을 의미한다. 이 때 react-router에 내장되어 있는 history 객체를 사용할 수 있고 외부에서 history 를 생성하여 주입할 수도 있다. 이번 프로젝트에서는 history를 외부에서 생성하여 주입하였고 많은 이점이 따라왔다.

history는 다음과 같이 주입할 수 있다.

```ts{3}
import { createBrowserHistory } from 'history'

const history = createBrowserHistory()
const boot = (rootId: string = 'root') =>
  render(
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>,
    document.getElementById(rootId)
  )
```

기존에 사용하고 있던 `Link`와 같은 태그는 그대로 사용할 수 있으며 3번 라인에서 생성한 history 객체를 이용하여 route 처리를 할 수 있다. 실제 프로젝트에서는 `historyUtils.ts`파일에서 history 객체를 생성하고 export하여 주입하였다.

### routing 처리를 saga에서?

route의 이동은 `a` 태그를 클릭하거나 react-router에서 지원하는 [Link](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/Link.md)태그를 통해 진행하는 것이 일반적이다. 하지만 비즈니스 로직 상으로 클릭 이벤트가 아니라 어떠한 조건에 의해서 `push`, `redirect`, `goback` 등의 라우팅을 처리해야하는 일이 빈번하다. 이럴 경우, 곤란해질 수 있는데, history 객체에 바로 접근할 수 있다면 이 로직들을 컴포넌트가 아닌 어딘가로 이동시킬 수 있다. 다음 코드는 사용하고 있는 historyUtils 코드 일부이다.

```ts
import { createBrowserHistory } from 'history'

export enum HISTORY_ACTION_TYPE {
  POP = 'POP',
  PUSH = 'PUSH',
}

const browserHistory = createBrowserHistory()

export function push(targetUrl: string) {
  browserHistory.push(targetUrl)
}

export function redirect(targetUrl: string) {
  browserHistory.replace(targetUrl)
}
```

대부분의 비즈니스 로직을 saga function에서 처리하고 있었기 때문에 이 부분도 비즈니스 로직 중 하나라고 생각하고 saga에서 처리했다.

어떠한 action에 의해 상태값이 변경되고 그 상태값에 따라 routing을 처리해야 한다면 코드를 다음과 같이 작성할 수 있다.

```ts
import { redirect } from '@/utils/historyUtils'

export function* testSaga() {
  const isDone = yield select(app.state)

  if (isDone) {
    yield call(redirect, '/home')
  }
  yield put(testAction.foo())
}
```

컴포넌트에서는 redux-saga에서 [takeLatest](https://redux-saga.js.org/docs/api/#takelatestpattern-saga-args)하고 있는 action을 dispatch 하게 되며 모든 로직은 saga에서 처리되고 그 action은 끝이 나게 된다. (컴포넌트, 넌 그리기만 해)

컴포넌트에서 상태에 따라 어떠한 action을 dispatch할 지, 또는 route를 변경할지 결정하지 않는다. (단순 클릭으로 인한 route 변경 제외) 컴포넌트에서는 사용자의 이벤트에서 어떠한 action을 호출할 것인지 결정하고 그 후의 로직들은 전부 saga라는 미들웨어에서 처리하는 구조이다. 컴포넌트는 그저 store의 상태 또는 자신이 관리하고 있는 local state에 따라서 어떠한 화면을 렌더링 할 지만 결정하고 action을 dispatch한다.

## With hooks

react-router가 [5.1.0 version](https://github.com/ReactTraining/react-router/releases/tag/v5.1.0) 을 배포하면서 hooks API가 포함되었다. 다음 네 가지 API이다.

- `useParams`
- `useLocation`
- `useHistory`
- `useRouteMatch`

hooks만 호출하여 기존에 [Route Props](https://reacttraining.com/react-router/web/api/Route/route-props)라는 props로 넘겨받던 데이터에 접근할 수 있다.

```ts
import { useParams } from 'react-router-dom'

export const VeryDumbComponent = () => {
  const { id } = useParams<Identity>()

  return <Something />
}
```

### 정리

이전 1,2,3 시리즈와 마찬가지로 고민들을 주로 다뤘다. react-router는 route를, 브라우저 history를 좀 더 쉽게 다루기 위한 라이브러리라서 별 내용은 없었다. router 이야기보다 directory 구조잡는 이야기가 더 많았던 것 같다. directory 구조는 시간을 들여 고민해줘야 할 정도로 중요한 것 같다. 특히 top level의 directory 구조는 프로젝트를 한 눈에 파악하는데 많은 정보를 가지고 있기 때문에 많은 시간을 들였다. (시간을 들이기 싫다면 angular...)

[_> React 테스트 시리즈 보러가기_](https://jbee.io/react/testing-0-react-testing-intro/)

|       |                                                       |
| :---: | :---------------------------------------------------: |
| Intro | [0. 들어가면서](https://jbee.io/react/react-0-intro/) |
