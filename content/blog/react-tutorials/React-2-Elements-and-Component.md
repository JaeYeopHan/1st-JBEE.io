---
title: '[React] 2. Elements and Component'
date: 2017-05-19 14:02:02
category: 'react'
---

![](/images/react_logo.png)

## Element

`Element`는 화면에 표시되는 내용이며, React를 구성하고 있는 가장 작은 블록이라고 할 수 있습니다. 브라우저 요소인 DOM과 달리 React Element는 보다 적은 비용으로 생성할 수 있으며 React DOM은 React Element와 일치하도록 DOM을 업데이트 합니다.

## Rendering Elements

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

위와 같은 html 코드가 존재합니다. 실제로 존재하는 코드는 `<div id="root"></div>`뿐이라고 볼 수 있습니다. React에서는 이것을 루트 노드(`Root DOM node`)라고 부릅니다. 이 태그 내부의 모든 element들은 `React DOM`에 의해 관리됩니다.

이전 포스팅에서 다뤘던 예제 코드를 다시 한번 살펴볼 차례입니다.

```js
const element = <h1>Hi!</h1>
ReactDOM.render(element, document.getElementById('root'))
```

`루트 노드`를 select하여 내부에 작성한 element를 `render`할 수 있습니다.

</br>

## Immutable Element

React element는 `immutable`입니다. element 렌더링한 후에는, 해당 element의 자식이나 attribute를 변경할 수 없습니다. React에서는 **새로운 element를 전달**하여 UI를 업데이트할 수 있습니다. 뭔가 너무 비효율적으로 보이지 않나요?

만약에 렌더링 된 element가 위의 예제처럼 짧지 않고 엄청 긴 element인데, 모든 element를 새로 전달해야 한다니. **하지만** React는 **필요한 부분만 업데이트** 합니다! React DOM은 새로 전달받은 element와 그 자식들을 이전의 element들과 비교하여 업데이트가 필요한 부분만 업데이트 합니다.

다음은 공식 홈페이지에 올라온 예제 코드입니다. 1초마다 `ReactDOM.render()`를 호출하여 UI를 업데이트합니다.

```js
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  )
  ReactDOM.render(element, document.getElementById('root'))
}

setInterval(tick, 1000)
```

개발자 도구를 열어서 확인해보면 `{new Date().toLocaleTimeString()}`부분만 업데이트 되는 것을 확인하실 수 있습니다.

</br>

## Components

Component는 Element로 구성될 수 있습니다. React에서는 Component를 설계하고 이를 사용하여 UI를 독립적이고 재사용 가능한 부분으로 분할할 수 있습니다.

### Component 정의

Component는 ES6의 `class`문법을 사용하여 정의할 수 있고 `React.createClass` 문법을 통하여 정의할 수 있고, `stateless한 Component`에 대하여 `functional Component` 방식으로 정의할 수 있습니다.

#### `class`문법을 사용하여 React.Component를 extends 하는 방식으로 컴포넌트를 정의.

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello React World!</h1>
  }
}
```

#### 일반 함수(or Arrow function)를 사용하여 컴포넌트를 정의

[React 공식 문서](https://facebook.github.io/react/docs/context.html)에서는 `stateless functional component`라는 용어로 해당 컴포넌트를 설명하고 있습니다. 개발자들 사이에서는 Pure Component, Dumb Component, Presential Component 라고 불리기도 합니다. UI를 구성하게 되는 Component 중 state가 없거나 LifeCycle API를 사용할 일이 없는 경우 함수를 사용하여 정의합니다. 즉, 렌더링의 역할만 수행하는 컴포넌트를 정의할 때 사용하는 방식이라고 할 수 있습니다.

```js
import React from 'react'
const dumb = () => <div>...</div>
export default dumb
```

위와 같이 Arrow function을 사용할 수도 있지만 일반 함수를 사용하는 경우에는 함수의 이름을 추론할 수 있기 때문에 airbnb convention에서는 다음과 같은 일반 함수 방식을 권장하고 있습니다.

```js
function dumb() {
  return <div>...</div>
}
```

Functional Component에 대해 자세히 설명된 포스팅입니다.[Velopert-함수형 컴포넌트](https://velopert.com/2994)

3. `React.createElement()`를 사용하여 컴포넌트를 정의
   사실 JSX로 작성된 element 또는 Component는 `React.createElement()`로 컴파일됩니다. React에서 일종의 sugar syntax를 제공하는 셈입니다. 즉 1번 case의 예제 코드는 다음과 같이 컴파일됩니다.

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello React World`)
  }
}
```

물론 위 코드도 `babel`에 의해 ES5 문법으로 transpile되겠지만 그 결과는 생략했습니다. 저번 포스팅에서도 언급된 [airbnb 에서 제공하는 React convention](https://github.com/apple77y/javascript/tree/master/react)에서는 JSX를 사용하고 있는데, 특별한 사유가 없다면 위 구문을 사용하지 말라고 합니다.

정의된 컴포넌트는 ReactDOM에서 render하거나 Component를 정의할 때 사용(composition)할 수 있습니다.

```js
class App extends Component {
  render() {
    return <Hello />
  }
}
ReactDOM.render(<App />, document.getElementById('root'))
```

혹시 위 예제와 이전 예제에서 차이점을 발견하셨나요? 일부러 다르게 작성해보았습니다. 달라진 점은 바로 `extends`하고 있는 클래스가 달라진 점인데요, 이 부분은 어떻게 React 라이브러리를 import하느냐에 따라 달라질 수 있습니다. 바로 위의 예제 같은 경우에는 다음과 같이 import하여 사용할 수 있습니다.

```js
import React, { Component } from 'react'
```

`Component`만 import하지 않고 `React`까지 import하는 것은 바로 `React.createElement()`로 컴파일 되기 때문입니다. 마찬가지의 이유로 일반 함수로 Component를 정의할 때도 `React`를 import해줘야 합니다. `React.Component`보다는 `Component`만 extends하는 것이 타이핑도 줄고 더 깔끔하겠죠? 물론 snippet이 제공되서 직접 타이핑 할 필요는 없지만요 :)

Element에 대해서 그리고 Component를 어떻게 정의하는가에 대한 포스팅이었습니다. 감사합니다 :D

React와 관련된 포스트는 [Github Repository](https://github.com/JaeYeopHan/react_tutorial_with_docs)에서 실시간 피드를 받으실 수 있습니다.

### References

- https://facebook.github.io/react/docs/react-without-jsx.html
