---
title: '[React] 5. 컴포넌트 디자인하기'
date: 2020-08-23 15:08:74
category: react
thumbnail: './images/react-ecosystem.png'
draft: false
---

![react-ecosystem](./images/react-ecosystem.png)

React는 자체적으로 '상태'를 관리하기 위한 `state` API를 제공하기 때문에 View 라이브러리이자 상태 관리 라이브러리라고 할 수 있다.

이 글은 React 시리즈의 [2번째](https://jbee.io/react/react-3-react-architecture/) 글을 반박하는 글이다. 정확히는 다음과 같은 문장을 반박하고자 한다.

> 모든 컴포넌트에서 store에 접근하여 필요한 데이터를 가져오고 렌더링만 수행한다.

store에 접근하는 컴포넌트는 재사용이 얼마나 가능할까? store를 사용하고 있지 않은 서비스에서는 당연히 재사용이 불가능 할 것이며 같은 서비스 안에서라도 유연하게 재사용이 불가능 해진다.

컴포넌트의 재사용을 위해 비즈니스 로직과 컴포넌트의 결합도를 높이는 방향으로 store에서 관리하고 있던 비즈니스 로직을 다시 컴포넌트로 가져오게 되면 어떤 문제가 발생할 수 있을까?

## 문제점 1. 로직의 재사용성

컴포넌트를 재사용하기 위해 비즈니스 로직을 컴포넌트 안에 두었더니 컴포넌트와는 별개로 비즈니스 로직만 재사용하고 싶을 경우에 또다시 문제가 발생할 수 있다.

store에서 도메인 단위로 비즈니스 로직을 분리해두었을 경우, 컴포넌트의 재사용은 떨어질 수 있지만 비즈니스 로직의 재사용은 가능해진다. store에 connect를 하게 되면 그대로 사용할 수 있기 때문이다. 그러나 컴포넌트에 비즈니스 로직이 들어가게 되면 로직 재사용이 어려워진다.

### Custom hooks

컴포넌트와의 결합도를 높이면서도 재사용이 가능하도록 비즈니스 로직을 구성하기 위해 hooks를 사용할 수 있다. 간단하게 input component의 focus를 제어하는 로직이 있다고 가정해보자.

```jsx
const Input = () => {
  const [value, setValue] = useState('')
  const [isFocus, setFocus] = useState(false)
  const focus = useCallback(() => setFocus(true), [])
  const blur = useCallback(() => setFocus(false), [])

  return (
    <input
      onChange={(e) => setValue(e.target.value)}
      onFocus={focus}
      onBlur={blur}
    />
  )
}
```

다른 `input` element를 다루는 컴포넌트에서 focus를 제어하는 로직이 필요하다면 위에 있는 코드를 그대로 작성해줘야 하지만 이를 custom hooks로 빼서 재사용 할 수 있다.

```jsx
function useFocus() {
  const [isFocus, setFocus] = useState(false)
  const onFocus = useCallback(() => setFocus(true), [])
  const onBlur = useCallback(() => setFocus(false), [])

  return [isFocus, onFocus, onBlur]
}
```

다음과 같이 custom hooks를 사용할 수 있다.

```jsx
const Input = () => {
  const [value, setValue] = useState('')
  const [isFocus, ...focusProps] = useFocus()

  return <input onChange={(e) => setValue(e.target.value)} {...focusProps} />
}
```

> 비즈니스 로직의 재사용은 Custom hooks를 통해 해결할 수 있다.

## 문제점 2. 상태 접근이 불편해진다.

컴포넌트 안에서 상태를 관리하고 있을 경우, 부모 컴포넌트에서는 그 상태에 대해서는 알 수가 없다. 그렇기 때문에 상태 끌어올리기(state lifting)이 필요해진다. 위 `Input` 컴포넌트의 상위 컴포넌트 `FormContainer` 에서 input element에 입력된 value에 접근하기 위해선 다음과 같은 수고로움이 발생한다.

```jsx
const Input = (props) => {
  return (
    <input
      value={props.value}
      onChange={(e) => props.onValueChange(e.target.value)}
    />
  )
}
const FormContainer = () => {
  const [value, setValue] = useState('')
  return (
    <section>
      <Input value={value} onValueChange={setValue} />
    </section>
  )
}
```

관리하고 있던 state를 부모 컴포넌트에서 관리하도록 리프팅(lifting) 해준 것이다. 이렇게 되면 문제는 해결되지만 계속해서 리프팅해줄 경우, 상당히 피곤해지고 props drilling이 발생하며 모든 것읓 부모 컴포넌트에서 제어해줘야 하는 것이 많아지고 비대해진다.

그리고 로직을 들고 있는 부모 컴포넌트와 실제 그 로직을 사용하는 컴포넌트가 멀어질수록 디버깅이 어려워지며 유연하게 대처가 어려워진다. (낮은 응집도)

```jsx
const FormContainer = () => {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [address, setAddress] = useState('')
  // 그 외 수많은 handler

  return (
    <section>
      <Input value={value} onValueChange={setValue} />
      <Input value={age} onValueChange={setAge} />
      <Input value={address} onValueChange={setAddress} />
    </section>
  )
}
```

하나의 컴포넌트에서 처리해줘야 하는 handler가 많아질수록 복잡해진다. 각각에 대한 validation 처리도 `FormContainer`에서 처리해야 한다면 더 복잡해질 것이다. 부모 컴포넌트가 알아야 하는 것은 value 뿐이다. 위 예제에서는 `name`, `age` , `address` 가 될 것이다. 필요한 값에만 접근할 수 없을까?

### useImperativeHandle

`ref` 를 넘겨서 필요한 값에만 접근하도록 하자.

```jsx
const Input = forwardRef((_, ref) => {
  const [value, setValue] = useState('')
  useImperativeHandle(ref, () => ({ value }), [value])

  return <input value={value} onChange={(e) => setValue(e.target.value)} />
})
```

`forwardRef` 로 전달받은 ref를 첫번째 파라미터로 전달해준다. Controlled(제어형) 컴포넌트로 할 경우에는 두번째 파라미터로 전달되는 callback에 `value`를 반환하는 함수를 전달해주면 된다. 자식 컴포넌트에서는 `useImperativeHandle`를 통해서 값만 노출하도록 하는 것이다.

```jsx
const FormContainer = () => {
  const nameRef = useRef('')
  const ageRef = useRef('')
  const addressRef = useRef('')

  return (
    <section>
      <Input ref={nameRef} />
      <Input ref={ageRef} />
      <Input ref={addressRef} />
      <button onClick={() => alert(nameRef.current.value)}>Click</button>
    </section>
  )
}
```

상위 컴포넌트에서는 각각의 `ref`를 통해 value에 접근할 수 있게 된다.

`Input` 컴포넌트에서 값과 핸들러를 모두 관리하면서 응집도가 높아진 장점을 유지하면서 부모에서도 쉽게 값에 접근할 수 있게 되었다.

이`Input` 컴포넌트는 Uncontrolled(비제어형) 컴포넌트로도 재작성 될 수 있다.

```jsx
const Input = forwardRef((_, ref) => {
  const inputRef = useRef(null)

  useImperativeHandle(ref, () => ({
    get name() {
      return inputRef.current.value
    },
  }))

  return <input ref={inputRef} />
})
```

## 문제점 3. 횡단 관심사 확장

기존에 사용하고 있던 Container, presentation component의 구조에선 Container에서 handler를 추가하고 그 함수를 drilling하여 전달하기만 하면 컴포넌트를 추가할 수 있었다. 그리고 추후 handler에 추가적으로 함수를 호출하기 위해서는 container에 존재하는 handler를 수정하면 되었다.

```tsx
const Container = () => {
  const log = (log: string) => console.log(log)
  const handleSubmit = () => {
    log('submit logging') // 부가적인 동작
    alert('submit!') // 의도한 수행 동작
  }
  const handleClear = () => {
    log('clear logging') // 부가적인 동작
    alert('clear') // 의도한 수행 동작
  }

  return (
    <>
      <SubmitButton onClick={handleSubmit} />
      <ClearButton onClick={handleClear} />
    </>
  )
}
```

store에서는 특정 action에 middleware를 추가하여 해결할 수 있었다.

`SubmitButton`에는 logging을 위한 handler가 추가적으로 props로 전달되어야 하며 이는 모든 컴포넌트에 반복되게 된다. 좀 더 좋은 방법이 없을까 고민하게 만드는 코드가 작성된다.

```tsx
const Container = () => {
  return (
    <>
      <SubmitButton data="submit" onLogging={() => log('submit logging')} />
      <ClearButton data="clear" onLogging={() => log('clear logging')} />
    </>
  )
}
```

### cloneElement

logging이라는 함수를 반복적으로 생성하여 전달해줘야 하는 문제를 횡단 관심사로 바라보고 공통으로 처리할 수 없을까? 예를 들면 다음과 같은 아름다운 모습으로 말이다. `SubmitButton` 컴포넌트에 추가적인 props를 전달하지 않으면서 `onClick` handler 호출 시 특정 callback을 심어주는 방식으로 한다면 아름다울 것 같다.

```jsx
const Container = () => {
  return (
    <WithLogging log="submit logging">
      <SubmitButton onClick={() => alert('submit')} />
    </WithLogging>
  )
}
```

React에서 제공하는 cloneElement라는 API를 통해서 응집도가 높은 컴포넌트를 확장할 수 있다. children을 받는 WithLogging 컴포넌트는 다음과 같이 만들 수 있다.

```jsx
const WithLogging = ({ children, log }) => {
  const child = Children.only(children)
  const logging = (log: string) => console.log(log)

  return cloneElement(child, {
    onClick: () => {
      child.props.onClick() // 본래 의도한 동작
      logging(log) // logging
    },
  })
}
```

children으로 받는 `SubmitButton`의 `onClick` handler에 `sendLog`라는 handler를 추가적으로 호출할 수 있도록 확장했다. 이와 같은 방법으로 `onClick` handler 뿐만 아니라 다른 attribute들도 확장할 수 있다.

## 문제점 4. 테스트

사실 store에서 관리하고 있는 로직을 테스트하는 것이 더 쉽다. 컴포넌트 테스트는 [testing-library/react-testing-library](https://github.com/testing-library/react-testing-library)를 사용해서 할 수 있고 custom hooks 테스트는 [react-hooks-testing-library](https://github.com/testing-library/react-hooks-testing-library)를 사용할 수 있다.

## 마무리

어떤 상태를 필요한 곳과 가장 가까운 곳에서 관리하고 외부에서 제한적으로 접근할 수 있도록 격리시켜서 컴포넌트를 설계하는 이야기를 해보았다. 모든 것에는 정답이 없듯이 2번째 글에서 이야기했던 All Dumb Component 또한 장단점이 있다. 재사용을 고려했을 때, store에서는 애플리케이션 전반에서 사용되는 상태만을 관리하고 지역 상태를 적극적으로 사용했을 때의 장단점도 함께 고려해서 프로젝트를 설계해야 한다.
