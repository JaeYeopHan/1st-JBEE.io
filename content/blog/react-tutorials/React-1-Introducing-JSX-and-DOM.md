---
title: '[React] 1. Introducing JSX and DOM'
date: 2017-05-15 13:15:27
category: 'react'
---

![](/images/react_logo.png)

## JSX란 무엇인가

```js
const element = <h1> Hello, world!</h1>
```

`JSX`라고 불리는 이 구문은 `string`도 아니고 `HTML`도 아닙니다. React 라이브러리에서 UI를 구성할 때 사용하는 구문으로 **JavaScript의 extension**이라고 할 수 있습니다.(물론, 사용하지 않을 수도 있습니다.) 타 프레임워크에서 사용했던 템플릿 엔진이라고 불리는 것들과 유사한 문법을 취하며(생김새만), JavaScript의 모든 기능을 제공합니다.

## JSX에 표현식 포함하기

자바스크립트의 표현식을 `{}`으로 묶어 JSX에 삽입할 수 있습니다. 기존의 템플릿 엔진에서 사용했던 방법과 비슷합니다. ES6에서 도입된 Template literal과도 비슷한 모습을 보입니다. 코드를 살펴보겠습니다.

```js
const element = <h1>Hi!</h1>
ReactDOM.render(element, document.getElementById('root'))
//이 코드는 다음 포스팅에서 설명하며, 다음 예제 코드부터는 추가하지 않습니다.
```

위와 같이 `element`라는 객체를 만들어서 `render()`메소드에 전달하여 렌더링할 수 있습니다.

```js
const element = <h1>1 + 1 = {1 + 1}</h1>
```

`{}`내부에서 자바스크립트 문법을 그대로 사용할 수도 있습니다.

## JSX는 결국 표현식입니다.

컴파일이 끝나면 JSX 표현식은 일반 자바스크립트 **객체**가 됩니다.

```js
let url = 'api/get/someting'
const element = <img src={url} />
```

JSX로 HTML 태그의 속성 값을 지정하고자 할 때는 `""`(double quote)를 사용하지 않습니다. 사용하게 되면 JSX는 속성을 표현식이 아닌 문자열 리터럴로 인식하게 됩니다. 위 `img`태그의 경우처럼 태그가 비어있으면 `/>`로 바로 닫아줘야 합니다. 자식 컴포넌트가 없거나 한 줄로 element 작성이 끝나는 경우에는 닫힘 태그로 self-close를 해줍니다.

```js
const element = (
  <div>
    <h1>Hi</h1>
    <h2>1 + 1 = {1 + 1}</h2>
  </div>
)
```

위의 같은 경우처럼 HTML의 문법을 사용하여 태그들을 계층화하여 구성할 수 있습니다. 하지만 이 때 주의할 사항이 한 가지 있습니다. 반드시 루트 노드(Root Node)로 **하나의 노드를 지정**해야 한다는 것입니다. ReactDOM은 오직 하나의 루트 노드만 렌더링하기 때문에 다음의 경우는 렌더링하지 못합니다.

```js
//Error!
const element = (
    <h1>Hi</h1>
    <h2>1 + 1 = {1 + 1}</h2>
);
```

동일 depth에 존재하는 element가 여러 개 존재하기 때문에 error가 발생하게 됩니다. 여러 개의 element들을 계층화하는 경우에는 이전의 예제 코드처럼 element들을 `div`태그로 감싸줘야 합니다.

기본적으로 `React DOM`은 렌더링하기 전에 JSX에 임베디드 된 모든 값을 이스케이프 처리합니다. 따라서 응용프로그램에 명시적으로 작성되지 않은 것을 삽입할 수 없고 XSS 공격을 방지할 수 있습니다.

## DOM Elements

React는 성능과 크로스 브라우징 이슈를 해결하기 위해 브라우저로부터 독립적인 DOM 체계를 구축하고 있습니다. 그렇기 때문에 기존의 HTML 속성과 다른 점이 존재합니다.

### Camel-Case Attributes

기본적으로 React에서는 모든 DOM 속성 또는 이벤트 핸들러를 Camel-case로 처리해야 합니다.

### 다른 Attributes

#### style

`style` 속성은 camelCase를 기반으로 작성된 style JavaScript 객체로 설정합니다. 모든 DOM의 속성과 일치하여, 원래 CSS에서 사용하던 속성들을 camelCase로 변경해서 사용할 수 있습니다.

```js
const headerStyle = {
  backgroundColor: '#EEE';
  borderRadius: '5px';
};

const element = (
    <div style={headerStyle}>Apply style as camelCase</div>
);
```

#### className

기본적으로 HTML에서는 태그에 class를 지정해줄 때, `<div class="container"></div>`와 같은 방식을 사용했습니다. 그러나 React에서는 `className`이라는 속성을 통해 접근합니다. 다음과 같이 나타낼 수 있습니다.

```JSX
const container = (<div className="container"></div>);
```

cf> JSX 속성값에는 항상 **double quote**를 사용합니다. JSX 속성값을 제외한 나머지 경우에 대해서는 **single quote**를 사용합니다. 강제적인 것이 아닌 [airbnb 에서 제공하는 React convention](https://github.com/apple77y/javascript/tree/master/react) 입니다.

#### onChange

이 속성을 가지고 있는 필드가 변경될 때마다 이벤트가 발생합니다. React에서는 실시간으로 사용자 입력을 처리하기 위한 방법으로 이벤트를 사용합니다.

```jsx
<input onChange={this.handleChange} />
```

위 예제 코드에서는 `input`태그에 event가 발생할 때마다 `handleChange`라는 메소드가 호출됩니다.

#### checked

`input`태그 중 `checkbox`타입 또는 `radio`타입에서 지원되는 `checked` 속성입니다. 이 속성은 `controlled components`에 대해서 사용할 때 유용합니다.

#### value

`value` 속성은 `input`과 `textarea`태그에 대해 지원되는 속성입니다. 이 속성을 통하여 요소의 값을 설정할 수 있습니다. 하지만 이 값은 DOM의 값보다 우선됩니다. 그렇기 때문에 이 속성은 `controlled components`에 대해서 사용할 때 유용합니다. 초기값만 지정하려는 경우에는. 즉 `uncontrolled components`에 대해서는 `defaultValue` 속성을 사용할 수 있습니다.

#### defaultValue, defaultChecked

`<textarea>`와 `<input type='text'>`에 대해서 지원합니다. 또한 `type=checkbox`와 `type=radio`타입의 `<input>`태그에 대해서는 `defaultChecked`를 지원합니다.

```js
<input type="text" defaultValue="Jbee" />
```

#### htmlFor

```js
const element = (
  <div>
    <label for="name">Name: </label>
    <input type="text" />
  </div>
)
//"Warning: Unknown DOM property for. Did you mean htmlFor?
//  in label
//  in div"
```

`for`를 대체하는 `htmlFor`입니다. `for`속성을 사용하려고 하면 warning이 발생합니다.

```js
const element = (
  <div>
    <label htmlFor="name">Name: </label>
    <input type="text" />
  </div>
)
```

JavaScript 문법의 `for` 예약어와 겹치기 때문에 `htmlFor`가 생겨났습니다.

#### dangerouslySetInnerHTML

이 속성은 DOM에서 사용하던 `innerHTML` 속성을 대체하기 위해 만들어졌습니다. 코드에서 HTML을 설정하는 것은 XSS 공격에 노출되기 쉽기 때문에 위험합니다. 그렇기 때문에 React에서는 이 속성 사용을 최소화하기 위해 장치를 마련해놓은 것입니다.

```js
function innerHTML() {
  return { __html: 'Dangerous inner html!' }
}

function component() {
  return <div dangerouslySetInnerHTML={innerHTML()} />
}
```

그럼에도 불구하고 `dangerouslySetInnerHTML` 속성을 사용하려면 위의 예제 코드와 같이 `__html`이라는 키 값과 함께 객체를 전달하여 사용할 수 있습니다.

React와 관련된 포스트는 [Github Repository](https://github.com/JaeYeopHan/react_tutorial_with_docs)에서 실시간 피드를 받으실 수 있습니다.

### References

- [React Documentation - Introducing JSX](https://facebook.github.io/react/docs/introducing-jsx.html)
- [React Documentation - DOM Elements](https://facebook.github.io/react/docs/dom-elements.html)
