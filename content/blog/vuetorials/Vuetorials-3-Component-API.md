---
title: '[Vuetorials] 3. Component API'
date: 2018-10-23 12:01:56
category: 'vue'
---

![](./vuetorials.png)

## Component API

컴포넌트에는 여러 가지 내용들이 기술될 수 있음. 객체에 `[key-value]` 형식으로 기술됨. 성격이 다른 옵션 API 들이 아무런 그룹없이 존재할 수 있기 때문에 객체로 기술할 경우 인위적인 그룹화가 필요해보임. (내키는대로 작성하게 되면 가독성 폭망할 듯.)

1. DOM rendering 과 관련된 내용
2. 컴포넌트에서 사용될 data 에 대한 내용
3. 컴포넌트의 라이프 사이클 메소드
4. 에셋이라고 표현한 옵션들.
5. 기타라고 표현한 옵션들

각각의 내용에 대해서는 [공식 문서](https://kr.vuejs.org/v2/api/#data)에 잘 나와있음. 자질구레한 **제한**이 있고 이런 제한에 대해서는 **런타임에** 에러가 발생함. 몇 가지 짚고 넘어갈 API 만 살펴봄.

### [props](https://kr.vuejs.org/v2/api/#props)

컴포넌트가 전달받을 props 에 대해 기술하기 위한 API 임. 단순히 배열로 표현이 가능하지만 객체로 기술할 경우, 타입 체크 및 유효성 검사 로직을 추가할 수 있음. 검사 대상은 다음 네 가지 임.

```js
export default {
  props: {
    // 타입 체크만
    height: Number,
    // 타입 체크와 유효성 검사
    age: {
      type: Number,
      default: 0,
      required: true,
      validator: function(value) {
        return value >= 0
      },
    },
  },
}
```

`props`에 추가될 수 있는 프로퍼티를 interface 로 구성하자면 다음과 같음.

```ts
interface PropPropertyInterface {
  type?: Function | Array<Function> | null = null;
  default?: any = undefined;
  required?: boolean = false;
  validator?: Function = void;
}
```

그 무엇하나 필수가 아님. 필수가 아니기 때문에 `age: {}`로 해도 그냥 돌아감. props 와 관련된 로직은 [여기](https://github.com/vuejs/vue/blob/dev/src/core/util/props.js#L14)에서 볼 수 있음. JavaScript 환경에서는 Interface 또는 type alias 를 별도로 지원하지 않으니 반쪽짜리 타입 체크가 될 수 밖에 없음. `validator` 부분과 객체로 기술 한다는 부분에서는 React 의 [prop-types](https://github.com/facebook/prop-types)보다 낫다고 봄. 실제로 `validator`를 쓸 지는 잘 모르겠음. (제보 부탁드림.)

### [data](https://kr.vuejs.org/v2/api/#data)

```js
export default {
  // Recommend
  data() {
    return { ... }
  }
  // or
  data: function() {
    return { ... }
  }
}
```

data 는 `this`에 value 들을 바인딩(binding)해야 하기 때문에 메소드 형태나 `function` keyword 를 사용하여 함수 형태로 기술해줘야 함. 화살표 함수(arrow function)을 쓰면 this binding 이 외부 context 를 잡게 되고 undefined 가 되어 `data`로 기술한 객체에 Vue 인스턴스에서 접근할 수 없음. 이게 런타임에서 에러나는게 참 아쉬움.

### [computed](https://kr.vuejs.org/v2/api/#computed)

```js
export default {
  computed: {
    totalSum: function() { ... } // only getter
    addTo: {
      get: function() {
        return this.num;
      },
      set: function(val) {
        return this.num + val;
      }
    }
  }
}
```

이 API 는 [**cache**](https://kr.vuejs.org/v2/guide/computed.html)가 핵심임. getter 와 setter 로 접근이 가능함. 변경 사항을 반영할 때 caching 때문에 methods 를 사용하는 것보다 빠르게 계산할 수 있음. `cache:false`를 통해서 cache 기능을 끌 수도 있음. `data` API 와 마찬가지로 각각의 프로퍼티는 arrow function 을 사용하면 안 됨. (같은 이유임) 3.0에서는 Proxy를 통해 getter, setter가 구현될 예정이라고 함.

### [render](https://kr.vuejs.org/v2/api/#render)

React 에서 익숙하게 봐오던 API 임. Vue 컴포넌트에서는 `<template>` 태그로 HTML 을 기술할 수 있었음. 하지만 이 API 를 통해 React 처럼 렌더링 될 HTML 을 기술할 수 있음. `render` function 에는 `createElement: () => VNode`가 파라미터로 전달됨. 이걸 이용해서 HTML 엘리먼트를 기술할 수 있음.

```js
export default {
  render: function(createElement) {
    return createElement(
      'ul',
      this.todos.map(item => createElement('li', item.content))
    )
  },
}
```

각각의 태그를 저렇게 명시해줘야 하는 부분이 너무 귀찮음. [babel-plugin-transform-vue-jsx](https://github.com/vuejs/babel-plugin-transform-vue-jsx)를 추가하면 `render` 함수의 return value 를 JSX 로 사용할 수 있음.

#### Stateless Functional Component

이 API 로 상태가 없는 functional component 를 만들 수 있음. (일단 React 에 비해 뭘 잔뜩 적어줘야 함.)

```js
export default {
  functional: true,
  render: function(createElement, context) {
    const { props } = context;

    return createElement('ul', props.todos.map(...))
  }
}
```

Vue 는 기본적으로 `this`에 필요한 데이터나 메소드 등을 binding 해주는데 함수형 컴포넌트(Functional Component)일 경우, `this`에 접근하지 못하기 때문에 `functional: true`일 경우, `render` function 에 두번째 파라미터로 `context`를 넘겨줌. 이 `context`를 **FunctionalRenderContext**이라 하며 ``data`,`props`,`listeners` 등에 접근할 수 있음. 이 함수형 컴포넌트의 경우에는 multi-root 로 렌더링 할 수 있음.

#### 마무리

다루지 않은 많은 API 들이 존재하지만 필요할 때 공식 문서에서 확인 가능함. 해당 글이 길어졌기 때문에 다뤄야 할 다른 API 가 있으면 다른 포스팅에서 다룰 예정임.

### Reference

- [Vue Official Doucument](https://kr.vuejs.org/v2/api/)
