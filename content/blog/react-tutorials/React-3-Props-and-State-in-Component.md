---
title: '[React] 3. Props and State in Component'
date: 2017-06-13 11:23:14
category: 'react'
---

![](/images/react_logo.png)

React Component에는 `props`라는 것이 존재합니다.

## props

`Props`은 컴포넌트가 가지고 있는 속성으로 컴포넌트 내부에서는 `this.props.[xxx]`와 같은 형식으로 접근할 수 있는 것을 말합니다. `Props`은 외부에서 컴포넌트로 전달하는 값이기 때문에 컴포넌트 내부에서 전달받은 `props`을 변경해서는 안됩니다. 즉 `Props`은 immutable한 속성을 갖고 있습니다.

### Use Props

함수로 작성된 Component의 경우와 class 문법으로 작성된 Component의 경우, 두 가지에 대해서 props를 살펴봅니다.

```js
function App(props) {
  return <h1>Hello, {props.name}</h1>
}

ReactDOM.render(<App name="Jbee" />, document.getElementById('root'))
```

Component 외부(해당 Component를 사용하는 Component 또는 render 메소드)에서 name이라는 속성을 props라는 객체를 통해 전달할 수 있습니다. 함수로 작성된 Component에서는 파라미터를 통해 `props`를 전달받아 이를 내부에서 사용할 수 있습니다. ES6의 destructuring 문법을 사용하면 다음과 같이 사용할 수 있습니다.

```js
function App({ name }) {
  return <h1>Hello, {name}</h1>
}

ReactDOM.render(<App name="Sara" />, document.getElementById('root'))
```

class 문법을 사용하여 Component를 정의하는 경우에는 `constructor`를 통해 props를 받아 사용할 수 있습니다.

```js
class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return {
      <div>Hello! {this.props.name}</div>
    }
  }
}
ReactDOM.render(
  <App name="Jbee"/>,
  document.getElementById('root')
);
```

`constructor(props)`내부에 `super(props)`이 부분이 보이시나요? 이 부분을 빠뜨리면 에러가 발생합니다. ES6 문법에서도 어떠한 클래스를 상속받은 다음 super를 호출해주지 않으면 에러가 발생하는데요, 그와 같은 원리라고 생각하시면 됩니다.

### TypeChecking to Props

컴포넌트가 외부와의 데이터를 주고 받기 위해 props를 사용했는데요, 이럴 경우 props의 Type을 확인해줘야 하는 필요성이 생깁니다. (물론 애플리케이션의 크기가 작을 때는 props를 주고 받는 것이 한 눈에 보이기 때문에 필수적이지는 않습니다. 하지만 정적 언어를 주로 사용하셨던 분들에게는 적지 않은 찝찝함이 남아있을 거라생각합니다.)

이러한 니즈를 충족시키기 위해 기존에는 React.PropTypes라는 방식을 사용했지만 React v15.5 부터 prop-types라는 npm을 통해 해결합니다. Facebook에서 개발한 `Flow`를 사용하는 방법도 존재하고, MS의 `TypeScript`를 사용하는 것도 한 가지 방법이겠습니다 :)

기존의 방식과 npm을 설치하는 방법은 import 구문이 추가되는 것을 제외하고 모두 동일합니다.
App Component에서 받는 props에 대한 TypeChecking 예제 코드입니다.

```js
App.propTypes = {
  title: React.PropType.string,
  author: React.PropType.string.isRequired
  onSubmit: React.PropType.func
}
```

기존의 React에 포함되어 있는 `PropType`을 사용하는 경우에는 위와 같이 사용하면 됩니다. 필수적으로 요구하는 값에 대해서는 `isRequired`라는 속성을 더해줍니다. (포스팅을 작성하는 시점에서는 경고 메시지만 로그로 찍힐 뿐 실행에는 문제가 없습니다.)

`Prop-Types` npm 설치는 다음과 같습니다.

```bash
$ npm install --save prop-types
# or
$ yarn add prop-types
```

그리고 해당 npm을 import하여 사용할 수 있습니다.

```js
import PropTypes from 'prop-types'
App.propTypes = {
  title: PropType.string,
  author: PropType.string.isRequired,
  onSubmit: PropType.func,
}
```

`Prop-Type`npm에서는 다음과 같은 Type들을 제공합니다.
`array`, `bool`,`func`,`number`,`object`,`string`,`symbol`,`node`,`element`
또한 다음과 같은 메소드를 제공하여 보다 강력한 TypeChecking을 제공합니다.
`instanceOf()`,`oneOf([[array]])`,`oneOfType([[array]])` etc...
보다 더 자세한 내용은 다음 링크를 참고하시면 됩니다. [reactjs/prop-types](https://github.com/reactjs/prop-types)

### Set Default Props

Component에서 외부로부터 받기로 한 props가 전달되지 않았을 경우를 대비해 props에 대한 default value도 지정해줘야 합니다. default props를 지정하는 것은 props의 type을 check하는 것과 매우 유사합니다.

```js
App.defaultProps = {
  title: 'unknown',
  author: 'unknown',
  onSubmit: () => console.warn('onSubmit function is not defined!'),
}
```

각 타입에 맞는 적절한 default value를 설정해줄 수 있습니다. propType을 통해 정의한 type은 defaultProps에도 적용됩니다.

## State

Component 내부에서 관리해야하는 상태 값이 존재하는 경우 `state`를 통해 관리할 수 있습니다. 이 `state`는 `constructor()` 내부에서 정의할 수 있습니다.

```js
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSelected: false,
    }
  }
}
```

위의 예제 코드와 같이 Object로 state를 관리할 수 있습니다. state를 **업데이트할 경우**에는 Component의 `.setState()`라는 메소드를 사용할 수 있습니다.

```js
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSelected: false,
    }
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    this.setState({ isSelected: true })
  }
}
```

Component의 `.setState()`메소드를 사용하는 메소드를 만들었습니다. Component의 메소드를 JSX 구문에서 사용하기 위해서는 `constructor`내부에서 `this`를 binding해줘야 합니다. 해당 메소드를 실행하는 시점에서 메소드 내부에 정의된 `this`가 달라지기 때문입니다.

`.setState()`에 대해서 추가적으로 반드시 알아둬야 하는 부분이 있습니다. 바로 이 메소드는 비동기로 호출된다는 점입니다. 즉 일반 메소드처럼 콜스택에 추가되어 호출되는 것이 아니라 이벤트 큐로 들어가게 됩니다. 메소드를 호출할 때 이 부분을 유의하여 작성해야 합니다 :)

### 마무리

외부, 즉 상위 컴포넌트에 의해 값이 변경될 수 있는 경우에 대해서는 props를 통해 해결하고 이 props는 해당 컴포넌트에서 변경해서는 안됩니다. 컴포넌트 내부에서 변경될 수 있는 값에 대해서는 state를 통해 해결합니다.

React와 관련된 포스트는 [Github Repository](https://github.com/JaeYeopHan/react_tutorial_with_docs)에서 실시간 피드를 받으실 수 있습니다.

#### References

- https://facebook.github.io/react/docs/components-and-props.html
- https://facebook.github.io/react/docs/typechecking-with-proptypes.html
