---
title: '[React] 4. Component Life Cycle'
date: 2018-01-01 17:08:03
category: 'react'
---

![](/images/react_logo.png)

_해당 글은 원작자의 허가를 받고 번역한 글 입니다._
_원본 링크 : https://engineering.musefind.com/react-lifecycle-methods-how-and-when-to-use-them-2111a1b692b1_

### Table of contents

- Intro
- React Component Life Cycle
  - componentWillMount
  - componentDidMount
  - componentWillReceiveProps
  - shouldComponentUpdate
  - componentWillUpdate
  - componentDidUpdate
  - componentWillUnmount

## Intro

![](/images/react_component_life_cycle.png)

위 다이어그램은 React 컴포넌트의 출생(pre-mounting)과 사망 (unmounting)에서의 Life Cycle입니다. React의 장점은 복잡한 UI를 작은 크기로 나누는 것입니다. 따라서 앱을 각각의 컴포넌트 단위로 분류 할 수 있을 뿐만 아니라 각 컴포넌트에 대해 customize 할 수 있습니다.

React Component의 라이프 사이클 메소드를 통해 UI의 각 컴포넌트가 **렌더링(rendering)**, **업데이트(update)**, **재렌더링(re-rendering)** 될 때를 고려할 수 있으며 **완전히 사라질 때(unmount)** 일어나는 일을 제어 할 수 있습니다.

## React Component Life Cycle

React 컴포넌트의 생명 주기를 부분적으로 나누어 간단히 살펴보면 다음과 같습니다.

### Mounting

React 컴포넌트의 인스턴스가 생성되고 DOM에 삽입되는 과정의 life cycle 입니다.

1. constructor
2. componentWillMount
3. render
4. componentDidMount

### Updating

`prop` 또는 `state`의 변경으로 해당 컴포넌트가 re-render 되는 경우의 life cycle 입니다.

#### Props Change

1. componentWillReceiveProps
2. shouldComponentUpdate
3. componentWillUpdate
4. render
5. componentDidUpdate

#### State Change

1. shouldComponentUpdate
2. componentWillUpdate
3. render
4. componentDidUpdate

### Unmounting

- componentWillUnmount

이제 각각에 대해서 살펴봅시다.

## `componentWillMount`

개발자가 정의한 컴포넌트는 눈 깜짝할 사이에 화면에 그려집니다. 이 순간 무엇을 할 수 있을까요? 그에 대한 대답은 사실 할 수 있는 것이 별로 없습니다. `componentWillMount` 메소드는 딱히 쓸모가 없습니다.

`componentWillMount`에서는 아직 생성된 컴포넌트가 없으므로 DOM 관련 작업을 수행 할 수 없습니다. 또한 컴포넌트의 기본 구성(`props` or `state`)을 설정하는 생성자(constructor)가 호출된 이후에는 아무 것도 변경되지 않았습니다.

```js
export default class Sidebar extends Component {
  tooltipsEnabled = true

  constructor(props) {
    super(props)
    this.state = {
      analyticsOpen: false,
      requirementsOpen: false,
      brandInfoOpen: false,
    }
  }
}
```

생성자가 호출되고 나면 그 상태가 바로 컴포넌트의 초기 상태가 됩니다. 추가적인 라이프 사이클 메소드를 복잡하게 사용하지 않고도 거의 모든 것이 컴포넌트 코드의 나머지 부분에서 처리되어야 합니다. 그 중에서도 예외가 있다면 초기에만 수행할 수있는 설정 즉, 외부 API에 연결하는 작업이 있을 것입니다. 예를 들어, 앱에 Firebase를 사용한다면, 앱이 처음 설치 될 때 설정을 가져와야합니다. 그러나 여기서 핵심은 이러한 작업은 앱의 최상위 컴포넌트 (루트 컴포넌트)에서 수행되어야 한다는 것입니다.

이는 컴포넌트의 99 %가 `componentWillMount`를 사용하지 않아야 함을 의미합니다. `componentWillMount`를 사용하여 컴포넌트에 대한 데이터를 로드하기 위해 AJAX 호출을 시작하는 사람들을 볼 수 있습니다. 하지만 이 글을 읽는 당신은 이러지 않았으면 좋겠습니다. 바로 다음 section인 두번째 section에서 이 부분에 대해 이야기하겠습니다.

#### 이 메소드의 가장 일반적인 사용 사례

- 루트 컴포넌트에서 App과 관련된 외부 API를 설정할 떄.
- setState 호출(?) : `setState`도 호출하지 말고 constructor에서 설정한 `this.state`를 사용하세요.

## `componentDidMount`

이제 컴포넌트가 mount되고 사용할 준비가 되었습니다.

`componentDidMount`는 가지고 놀 컴포넌트가 없을 때 할 수 없었던 것들을 모두 할 수 있는 메소드입니다. 몇 가지 예를 들면 다음과 같습니다.

- `<canvas>` 에 렌더링을 수행한다.
- 요소 컬렉션에서 [Masonry](https://masonry.desandro.com/) 그리드 레이아웃을 초기화한다.
- Event listener를 추가한다.

기본적으로 여기에서는 DOM에 대한 접근이 필요한 모든 설정을 수행하고 필요한 데이터를 가져오기 시작합니다.

#### 이 메소드의 가장 일반적인 사용 사례

- Ajax 호출을 시작하여 컴포넌트에서 사용해야 하는 데이터를 로드합니다.
- setState를 호출할 수 있습니다.

## `componentWillReceiveProps`

컴포넌트가 정상적으로 잘 동작하고 있었는데 새로운 `props`가 전달되었습니다. 아마 상위 컴포넌트에서 `componentDidMount`에 의해 로드된 데이터 중 일부가 내려왔을 것입니다.

새로운 `props`로 어떠한 작업을 수행하기 전 이 새로운 `props`를 인자로 하여 `componentWillReceiveProps`가 호출됩니다.

```js
componentWillReceiveProps(nextProps) {
  if (parseInt(nextProps.id, 10) !== parseInt(this.props.id, 10)) {
    this.setState({ postsLoaded: false });
    this.contentLoaded = 0;
  }
}
```

우리는 이 메소드 안에서 `nextProps`를 통해 다음의 `props`(새로운 `props`)에 접근할 수 있고 `this.props`를 통해 현재의 `props`에 접근할 수 있습니다.

이 메소드에서 우리 해야하는 것은 다음과 같습니다.

1. props가 바뀌었는지 확인합니다. 가끔 `props`가 변경되지 않은 경우에도 호출됩니다.
2. 만약 `props`가 변경되었다면 그에 따라 로직을 구성해야 한다.

새로운 `props`를 받았을 때, 다음과 같이 처리합니다.

```js
componentWillReceiveProps(nextProps) {
  if (this.props.percent !== nextProps.percent) {
    this.setUpPercent(nextProps.percent);
  }
}
```

하나 더 주의해야 할 것은 `componentWillReceiveProps`는 초기 렌더링시 호출되지 않습니다. 코드 상으로는 컴포넌트가 `props`를 받는다는 것을 의미하지만 비교할 기존의 `props`가 없으므로 로직에 포함되지 않습니다.

#### 이 메소드의 가장 일반적인 사용 사례

- 해당 컴포넌트의 상태 변경에 영향을 끼지는 `props`의 변경에 따라 로직을 구성합니다.
- setState를 호출할 수 있습니다.

## `shouldComponentUpdate`

컴포넌트가 불안정한(?) 상태입니다. 이 메소드가 호출되었다는 것은 현재 컴포넌트의 상태와 view에 그려진 내용, 상태가 다르다는 것을 의미하기 때문입니다.

우리에게는 새로운 `props`가 있습니다. 전형적인 React 신조에 따르면 컴포넌트가 새로운 `props`나 새로운 `state`를 받으면 업데이트해야 한다고 말합니다.

`shouldComponentUpdate` 메소드는 `nextProps`를 첫 번째 인수로 사용하고 `nextState`는 두 번째 인수로 사용합니다.

```js
shouldComponentUpdate(nextProps, nextState) {
  return this.props.engagement !== nextProps.engagement
    || nextState.input !== this.state.input;
}
```

`shouldComponentUpdate`는 항상 `boolean`을 반환해야 합니다. 이것은 "해당 컴포넌트를 다시 렌더링(re-render)해야 하나요?"라는 질문에 대한 답이 됩니다. 해당 컴포넌트를 특별히 override하지 않는 이상 이 메소드는 기본적으로 `true`를 반환합니다.

하지만 불필요한 재렌더링(re-render)를 방지하기 위해서는 `shouldComponentUpdate`를 override 할 수 있습니다. 자세한 내용은 다음 [링크](https://engineering.musefind.com/how-to-benchmark-react-components-the-quick-and-dirty-guide-f595baf1014c)를 참고해주세요. (이 링크에서는 많은 필드가 있는 테이블에서 테이블이 다시 렌더링 될 때 각 필드가 다시 렌더링되어 작업속도가 느려지게 된다는 것을 보여주고 있습니다.)

`shouldComponentupdate`를 사용하면 변화에 신경써야 하는 `props`의 변경에 대해서만 update를 진행할 수 있습니다. 하지만 이에 대한 설정을 잊으면 React 컴포넌트가 제대로 동작하지 않기 때문에 명심해야 합니다.

#### 이 메소드의 가장 일반적인 사용 사례

- 해당 컴포넌트의 re-render를 제어할 때 사용합니다.
- setState를 호출할 수 없습니다.

## `componentWillUpdate`

방금 전까지 컴포넌트를 update하는데 집중을 했는데요, 이 메소드에서는 update가 발생하기 전 어떠한 작업이 필요한 경우 해당 메소드 안에서 해결할 수 있습니다.
이 메소드는 메소드 내에서 `this.setState`를 호출할 수 없다는 점을 제외하면 기본적으로 `componentWillReceiveProps`와 동일합니다.

이미 `shouldComponentUpdate`를 사용 중인데 또 `props`가 변경될 때 작업이 필요한 경우 이 메소드가 적절하겠지만 추가적인 유용성은 많이 주지는 못할 것입니다.

#### 이 메소드의 가장 일반적인 사용 사례

- `shouldComponentUpdate`가 이미 사용되고 있는 컴포넌트에서 `componentWillReceiveProps` 대신 사용됩니다. 단 해당 메소드 내에서는 이전 `props`에 접근할 수 없습니다.
- setState를 호출할 수 없습니다.

## `componentDidUpdate`

이 메소드에서는 `componentDidMount`에서 했던 것과 동일한 작업을 수행할 수 있습니다. (예를 들면, 레이아웃을 다시 설정한다던가 canvas를 그린다던가)

`shouldComponentUpdate`가 호출된 다음, `render`가 호출된 다음 호출되는 메소드입니다. 하지만 아쉽게도 이 메소드 내에서는 어떠한 이유로 update가 이루어졌는지 알 수 없습니다. 그렇기 때문에 변경된 데이터에 대해 DOM조작을 다시 해줘야하는 경우가 있다면 이 메소드에서 수행해줄 수 있습니다.

`componentWillReceiveProps`에서도 충분히 해줄 수 있는 작업들이지만 불필요한 re-render를 방지하기 위해 DOM과 관련된 작업들을 주로 수행합니다.

```js
componentDidUpdate() {
  this.createGrid();
}
```

#### 이 메소드의 가장 일반적인 사용 사례

- `prop` 또는 `state`에 따라서 DOM을 업데이트 합니다.
- setState를 호출할 수 있습니다.

## `componentWillUnmount`

컴포넌트가 unmount 되기 전 호출되는 메소드로 마지막으로 수행해야하는 작업이 있다면 이 메소드에서 수행해줄 수 있습니다. 여기서는 네트워크 요청을 취소하거나 컴포넌트와 관련된 모든 이벤트 리스터를 제거할 수 있습니다. 기본적으로 해당 컴포넌트와 관련있는 작업들만 수행합니다.

#### 이 메소드의 가장 일반적인 사용 사례

- 컴포넌트와 관련된 것들을 제거하는 메소드입니다.
- setState를 호출할 수 없습니다.

### Conclusion

이상적인 애플리케이션에서는 life cycle 에 접근할 필요가 없습니다. 렌더링과 관련된 거의 모든 이슈는 `state`와 `props`만을 통해 제어될 수 있습니다. 하지만 몇몇의 경우, 컴포넌트의 업데이트 방법과 그 순간 순간에 대해 좀 더 명확히 제어할 필요가 있습니다. 때문에 life cycle에 접근하여 컴포넌트를 제어하는 것이 필요하다면 이상적인 동작에 영향이 끼치지 않도록 조심스럽게 사용해야 합니다.

### 마무리

일부 의역이 들어갔으며 오역이 존재할 수 있습니다. 해당 사항에 대해서는 댓글로 피드백 주시면 감사하겠습니다. 더 좋은 포스팅으로 뵙겠습니다! 감사합니다.

_해당 글은 원작자의 허가를 받고 번역한 글 입니다._
_원본 링크 : https://engineering.musefind.com/react-lifecycle-methods-how-and-when-to-use-them-2111a1b692b1_
