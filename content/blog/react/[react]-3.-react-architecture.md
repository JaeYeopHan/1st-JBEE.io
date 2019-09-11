---
title: '[React] 3. React Architecture'
date: 2019-09-09 20:09:30
category: react
---

![react-ecosystem](./images/react-ecosystem.png)

# Part III. React Architecture

React에서 널리 사용되는 Pattern(?)이라고 하면 [Dan의 Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)이 아닐까 생각된다. [16.8.x](https://github.com/facebook/react/releases/tag/v16.8.0)에서 도입된 [hooks API](https://reactjs.org/docs/hooks-intro.html)로 과연 이 구조가 의미가 있는 구조일까, 맞는 구조일까 다시 생각해보면서 구조를 잡아보았다.

## 고민 1. Function vs Class

우선 모든 컴포넌트를 함수(Function)로 작성했다. hooks가 나온 시점에, class component를 사용할 이유가 없었다. 함수로 작성되는 컴포넌트는 dumb라고 해서 props를 받아 화면만 렌더링하는 컴포넌트였지만 hooks의 등장으로 functional component로 작성함과 동시에 local state를 아주 유연하게 처리할 수 있게 되었다. 해당 컴포넌트에서만 제어되는 화면의 상태를 local state로 격리시킬 수 있었다.

### 마주친 문제 1. useEffect custom

[useEffect](https://ko.reactjs.org/docs/hooks-effect.html)는 컴포넌트가 마운트(mount)될 때 호출되며 dependency list에 등록된 값이 바뀔 경우 호출된다.

그런데 나는 `componentDidMount` 에서 최초로 한 번 호출된 후에는 `componentDidUpdate` 에서만 발생하도록 하고 싶었다.

class로 component를 작성할 경우에는 각각에 대한 라이프 사이클 메소드가 있었다. 각각의 라이프 사이클에서 함수를 실행할 조건문을 추가해주면 끝날 일이었다. 그러나 `useEffect`는 애초에 설계가 그렇게 되지 않았기 때문에 요구 사항을 구현할 수 없었다.

### 해결 방법. Custom hooks

`useEffect`, `useRef`를 사용하여 custom hook을 만들었고 이를 적용했다.

```ts
interface IUseConditionEffectOption {
  componentDidUpdateCondition?: boolean
  componentDidMountCondition?: boolean
}

export const useConditionEffect = (
  effectFunction: Procedure,
  deps: any[],
  option: IUseConditionEffectOption
) => {
  const didMountRef = useRef(false)
  const {
    componentDidUpdateCondition = true,
    componentDidMountCondition = true,
  } = option

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
      if (componentDidMountCondition) {
        effectFunction()
      }

      return
    }

    if (componentDidUpdateCondition) {
      effectFunction()
    }
  }, deps) //eslint-disable-line
}
```

298.38
`useConditionEffect` hook은 최초 mount 시, 한 번 호출된다. 그 후에는 `componentDidUpdate` 시에만 호출된다. 단, 인자로 넘겨준 `effectFunction`은 함께 넘겨준 condition이 true 일 경우에만 호출된다. 조금 복잡해지긴 했지만 이 문제를 해결한 후, hooks를 조합하여 해결하지 못할 문제는 없다는 결론을 내렸다.

### 마주친 문제 2. 키패드가 제대로 안올라옴.

useEffect를 사용하여 값이 변경될 경우, 키패드가 올라오도록 구현함. focus를 줘도 올라오지 않음. 무슨 이슈지?

### 해결 방법. useLayoutEffect

useLayoutEffect는 기본적으로 `useEffect`와 동일하지만 DOM을 제어하는 side effect일 경우 사용할 수 있다. 브라우저의 동작을 막지 않고 rerender를 시키는 useEffect와는 달리 useLayoutEffect는 동기적

```ts
useLayoutEffect(() => {
  if (ref.current) {
    ref.current.focus()
  }
}, [ref])
```

## 고민 2. Container and Dumb?

react-redux 의 hooks interface를 사용(자세한 내용은 [2.]()참고)했다. 즉 container 컴포넌트가 아니더라도 store에 접근할 수 있는 것이었다. 그렇기 때문에 container component에서 필요한 state를 모두 끌어오고 자식 컴포넌트들에게 props로 전달하는 노가다는 하지 않아도 된 것이다.

### All Dumb Components!

그렇다면 모든 컴포넌트에서 store에 접근하여 필요한 데이터를 selector를 통해 가져오고 렌더링만 하면 되겠다는 결론에 이르렀다. 또한 이벤트 핸들러에는 action을 dispatch하는 것만 추가해주면 되었다.

### Business logic?

특정 조건에 따라서 A라는 액션을 dispatch 하거나 버튼이 disabled되거나 하는 중요한 사항이 요구 사항에 있을 수 밖에 없다. 기존에는 이러한 비즈니스 로직과 관련된 구현 사항들이 container component에 구현되어 props로 전달해주었다. 비즈니스 로직과 관련된 코드들이 container에 모여있으니 응집도가 높았고 디버깅 할 때도 수월했다.

하지만 모든 컴포넌트에서 store에 접근하고 모든 컴포넌트에서 비즈니스 로직이 구현될 수 있는 상황에서는 시간이 지남에 따라 난잡해질 거라는 불길한 예감이 들었다.

### Delegate to saga

비즈니스 로직을 saga로직에 몰아넣었다. 특정 조건에 따라 dispatch해야 하는 action이 달라질 경우 그 조건을 saga 함수에서 구현했고 컴포넌트에서는 saga 함수를 호출하는 action만 dispatch하는 구조이다.

이 방식으로 `이벤트 핸들러에는 action을 dispatch하는 것만 추가`하는 것을 유지할 수 있었다.

## 고민 4. 컴포넌트 구성 방법

거의 모든 컴포넌트에서 store에 접근하고 action을 dispatch 하는 코드들이 들어가있으니 이것은 스타일과 스크립트의 혼재가 되었다. 하나를 해결하니 또 다른 문제가 발생한 것이다. 결론부터 말하자면 이 부분은 합성(composition)으로 최대한 해결하기로 하였다.

### 고민 4-1. 성급한 추상화에 대한 경계

정말 컴포넌트의 재사용이 많이 일어날까?에 대한 고민을 우선적으로 했던 것 같다. 오로지 스타일만을 담당하는 element 단위의 컴포넌트로 나누는 작업은 생각보다 시간이 오래걸린다. 이렇게 열심히 분리하여 컴포넌트를 작성했는데 분리된 element가 하나의 컴포넌트에서만 사용되는 상황이 발생하면 생산성이 떨어진다.

그러나 역할의 분리라는 측면에서 스타일을 담당하는 element 단위의 컴포넌트 그리고 이들로 구성되는 리액트 컴포넌트로 분리하는 것이 맞다는 결론을 내렸다.

### 고민 4-2. 합성과 조합

그렇다면 리액트 컴포넌트를 어떻게 구성할 것인가? 리액트에는 props로 전달하는 조합 방법도 있고 합성(composition) 하는 방법도 있다. 이를 구성하는데 있어서 결정되어야 하는 부분은 다음 두 부분이다.

- 무엇: 어떤 컴포넌트를 어떻게 전달하여 합성할 것인가
- 어디: 전달받은 컴포넌트를 컴포넌트의 어느 부분에 위치할 것인가

React에서 이 두 가지 이슈는 다음 두 방식으로 해결할 수 있다.

- key값을 props로 전달받아 조합.
  - 장) 컴포넌트에서 어떠한 컴포넌트가 조합될지 예측 가능하며 컴포넌트
  - 단) 새로운 컴포넌트를 조합하기 위해선 key값의 추가가 필요하다.
- 합성(children props로 전달)하여 해결
  - children은 children이라는 key로 이미 조합된 컴포넌트 묶음 하나만 전달받을 수 있다.
  - children으로 전달받는 컴포넌트에는 조합자 컴포넌트의 데이터, 이벤트 등 어떠한 것도 전달할 수 없다.
- render props

### 횡단 관심사로써의 바라보는 스타일

횡단 관심사란 하나의 애플리케이션에서 다양한 부분에 영향을 미치는 기능을 말한다. 스타일을 담당하는 컴포넌트는 하나의 애플리케이션에서 언제라도 재사용될 수 있다. 그래서 이 부분을 횡단 관심사로 처리하고 스타일을 담당하는 별도의 컴포넌트들로 분리한 후 이들을 합성하여 component를 구성했다.

### 합성(composition)의 아쉬운 점

Vue에도 합성을 위한 문법인 [slot]이 있다. Vue는 이 합성에 대한 부분이 더 고려가 되어 named slot이 있다. 합성을 할 때, 넘겨지는 값에 name을 추가하여 보다 확장성 있게 component를 합성할 수 있다. React에서는 `props.children`으로 넘겨지기 때문에 한 번에 두 개의 컴포넌트를 합성 후, 레이아웃을 다르게 진행하고 싶을 때, 난감하다. 이럴 경우 어쩔 수 없이 두 개의 컴포넌트 중 children과 성격이 더 잘 맞는 녀석을 children으로 넘기고 나머지는 props로 넘겨주어야 한다.

### 마무리

사실 위에서 다룬 모든 고민은 기존의 class component를 container component로 사용하고 function component를 presentational component로 사용하지 않는데서 출발했다. 혹시라도 나와 같은 시도를 할 계획이 있으신 분들에게 조금이나마 도움이 되리라 생각된다. 삽질은 계속 될 예정이다. 이러한 방식으로 컴포넌트를 작성하면서 고려해야 하는 부분이 하나 더 생겼는데 바로 디렉토리 구조이다. 알맞은 위치를 잡아주기 쉽지 않았는데 다음 편에 그 내용을 다룰 예정이다.

Next: [4. Directory Structure]
Intro: [0. 들어가면서](https://jbee.io/react/[react]-0.-intro/)
